import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { SelectionProduct, Variant } from './definitions';

const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const useVariants = (
  selections: SelectionProduct[],
  customization: boolean,
  initialVariants?: Variant[]
) => {
  const initialized = useRef(true);
  const [variants, setVariants] = useState<
    Required<Omit<Variant, 'sku' | 'stock'>>[]
  >(
    customization && !!initialVariants
      ? initialVariants?.map<Required<Omit<Variant, 'sku' | 'stock'>>>(
          (variant) => ({
            variant_name: variant.variant_name ?? 'default product',
            price: variant.price,
          })
        )
      : []
  );

  useEffect(() => {
    if (initialized.current) {
      initialized.current = false;
      return;
    }
    if (customization) {
      generateVariants(selections, setVariants);
    }
  }, [selections, initialized.current, customization]);

  return { variants, setVariants };
};

const generateVariants = (
  selections: SelectionProduct[],
  setVariants: Dispatch<
    SetStateAction<Required<Omit<Variant, 'sku' | 'stock'>>[]>
  >
) => {
  if (selections.length === 1) {
    setVariants((prev) => {
      const data = selections[0].options.map<
        Required<Omit<Variant, 'sku' | 'stock'>>
      >((option) => ({
        price:
          prev.find((value) => value.variant_name === option.value)?.price ?? 0,
        variant_name: option.value,
      }));
      console.log(data);
      return data;
    });
    return;
  }
  if (selections.length === 2) {
    let out: Required<Omit<Variant, 'sku' | 'stock'>>[] = [];

    setVariants((prev) => {
      selections[0].options.forEach((option) => {
        selections[1].options.forEach((secondOption) => {
          out.push({
            price:
              prev.find(
                (value) =>
                  value.variant_name === `${option.value}_${secondOption.value}`
              )?.price ?? 0,
            variant_name: `${option.value}_${secondOption.value}`,
          });
        });
      });
      return out;
    });
    return;
  }
  setVariants([]);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const isPassed = days + hours + minutes + seconds <= 0;

  return { hours, minutes, seconds, isPassed };
};

export { useCountdown, useVariants };

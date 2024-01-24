"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import SelectCategory from "./select-category";
import {
  Button,
  Switch,
  cn,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider,
} from "@nextui-org/react";
import { SelectionProduct } from "@/app/lib/definitions";
import Image from "next/image";
import clsx from "clsx";
import { RiImageAddFill, RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import SelectColors from "./select-colors";
import { useVariants } from "@/app/lib/hooks";
import InputMaterials from "./input-materials";
import Link from "next/link";
import { SubmitButton } from "../submit-button";
import { CreateProductState, createProduct } from "@/app/lib/actions";
import { useFormState } from "react-dom";

const listSelectionType = ["color", "material"];
const MaxSizeInBytes = 10 * 1024 * 1024;

export default function CreateProductForm() {
  const initialFile = {
    data: null,
    url: "",
    value: "",
  };
  const initialState: CreateProductState = {
    message: null,
    errors: {},
  };
  const [customizable, setCustomizable] = useState(false);
  const [selections, setSelections] = useState<SelectionProduct[]>([]);
  const { variants, setVariants } = useVariants(selections, customizable);
  const [files, setFiles] = useState<
    Array<{ data: File | null; url: string; value: string }>
  >([initialFile, initialFile, initialFile]);
  const [model, setModel] = useState<File>();
  const handleCreateProduct = createProduct.bind(
    null,
    customizable,
    selections,
    variants,
  );
  const [state, action] = useFormState(
    async (pervState: CreateProductState, formData: FormData) => {
      if (model) {
        formData.append("model", model);
      }
      files.forEach((file) => {
        if (file.data) {
          formData.append("images", file.data);
        }
      });
      return await handleCreateProduct(pervState, formData);
    },
    initialState,
  );
  const handlePriceChange = (numVal: number, index: number) =>
    setVariants((prev) => {
      return prev.map((variant, idx) => {
        if (idx === index) {
          return {
            ...variant,
            price: numVal ?? 0,
          };
        }
        return variant;
      });
    });

  // console.log(files);

  const handleDeleteImg = (currentKey: number) => {
    setFiles((prev) =>
      prev.map((data, key) => {
        if (currentKey === key) {
          return initialFile;
        }
        return data;
      }),
    );
  };

  const handleUploadImage = async (
    e: ChangeEvent<HTMLInputElement>,
    currentKey: number,
  ) => {
    const newFiles = e.target.files;
    if (newFiles !== null && newFiles.length !== 0) {
      const newFile = newFiles[0];
      if (newFile.size > MaxSizeInBytes) {
        toast.error("The image size must be no more than 10MB");
        return;
      }

      if (files.find((file) => file.data?.name === newFile.name)) {
        toast.error("You have uploaded this photo as a product image");
        return;
      }

      const newData = files.map((file, key) => {
        if (key === currentKey) {
          return {
            value: e.target.value,
            data: newFile,
            url: URL.createObjectURL(newFile),
          };
        }
        return file;
      });
      setFiles(newData);
    }
  };

  // console.log(variants);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      autoComplete="off"
      action={action}
      className="flex flex-col gap-4 w-full mb-24"
    >
      <Input
        variant="bordered"
        type="text"
        label="Product Name"
        placeholder="Enter Product Name"
        labelPlacement="outside"
        radius="sm"
        name="name"
        errorMessage={
          !!state.errors?.name &&
          state.errors.name.map((error: string) => <p key={error}>{error}</p>)
        }
      />
      <Textarea
        variant="bordered"
        name="description"
        label="Description"
        labelPlacement="outside"
        placeholder="Enter your description"
        errorMessage={
          !!state.errors?.description &&
          state.errors.description.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <SelectCategory
        name="category"
        errorMessage={
          !!state.errors?.category &&
          state.errors.category.map((error: string) => (
            <p key={error}>{error}</p>
          ))
        }
      />
      <div className="flex flex-col gap-4">
        <div className="w-full grid grid-cols-2 grid-rows-2 items-center gap-4">
          <Input
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-tiny">gram</span>
              </div>
            }
            label="Weight"
            type="number"
            placeholder="Enter Product Weight"
            labelPlacement="outside"
            radius="sm"
            name="weight"
            errorMessage={
              !!state.errors?.weight &&
              state.errors.weight.map((error: string) => (
                <p key={error}>{error}</p>
              ))
            }
          />
          <Input
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-tiny">cm</span>
              </div>
            }
            label="Width"
            type="number"
            placeholder="Enter Product Width"
            labelPlacement="outside"
            radius="sm"
            name="width"
            errorMessage={
              !!state.errors?.dimension?.filter((err) =>
                err.includes("width"),
              ) &&
              state.errors.dimension
                .filter((err) => err.includes("width"))
                .map((error: string) => <p key={error}>{error}</p>)
            }
          />
          <Input
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-tiny">cm</span>
              </div>
            }
            label="Length"
            type="number"
            placeholder="Enter Product Length"
            labelPlacement="outside"
            radius="sm"
            name="length"
            errorMessage={
              !!state.errors?.dimension?.filter((err) =>
                err.includes("length"),
              ) &&
              state.errors.dimension
                .filter((err) => err.includes("length"))
                .map((error: string) => <p key={error}>{error}</p>)
            }
          />
          <Input
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-tiny">cm</span>
              </div>
            }
            type="number"
            label="Height"
            placeholder="Enter Product Height"
            labelPlacement="outside"
            radius="sm"
            name="height"
            errorMessage={
              !!state.errors?.dimension?.filter((err) =>
                err.includes("height"),
              ) &&
              state.errors.dimension
                .filter((err) => err.includes("height"))
                .map((error: string) => <p key={error}>{error}</p>)
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Product Images</span>
          {!!state.errors?.images && (
            <span className="flex flex-col gap-1 text-tiny text-danger">
              {state.errors.images.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </span>
          )}
        </div>
        <div className="flex justify-start gap-5">
          {files.map((file, key) => (
            <div
              key={key}
              className={clsx("w-36 h-36", {
                "border-2 rounded-md border-dashed": !!!file.data,
                "border border-black rounded-md border-solid": !!file.data,
              })}
            >
              {file.data ? (
                <div className="group w-full h-full relative">
                  <Image
                    src={file.url}
                    alt={file.data.name}
                    fill
                    className="object-contain"
                    priority={true}
                  />
                  <Button
                    className="absolute bottom-1 right-1 hidden group-hover:flex"
                    isIconOnly
                    variant="ghost"
                    color="danger"
                    onClick={() => handleDeleteImg(key)}
                  >
                    <RiDeleteBin5Line size={18} />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor={`img-empty-${key}`}
                  className="hover:bg-foreground-200 w-full h-full flex flex-col gap-0 items-center justify-center cursor-pointer text-[#31353bad]"
                >
                  <RiImageAddFill size={64} />
                  <span>{key === 0 ? "Foto Utama" : `Foto ${key + 1}`}</span>
                </label>
              )}
            </div>
          ))}
        </div>
        {[...Array(3)].map((_, key) => (
          <input
            type="file"
            hidden
            id={`img-empty-${key}`}
            key={key}
            value={files[key].value}
            onChange={(e) => {
              handleUploadImage(e, key);
            }}
            accept=".jpg, .jpeg, .png"
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Product Model</span>
          {!!state.errors?.model && (
            <span className="flex flex-col gap-1 text-tiny text-danger">
              {state.errors.model.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </span>
          )}
        </div>
        <input
          type="file"
          className="border-2 cursor-pointer border-foreground-200 hover:shadow-sm hover:border-foreground-400 border-solid rounded-md p-3"
          accept=".glb"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setModel(files[0]);
            }
          }}
        />
      </div>
      <div className="flex gap-4 w-full items-start">
        <Switch
          value="true"
          classNames={{
            base: cn(
              "inline-flex self-stretch flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-foreground-600",
              "data-[selected=true]:border-primary",
            ),
            wrapper: "p-0 h-4 overflow-visible bg-foreground-600",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg border-foreground-600",
              "group-data-[hover=true]:border-primary",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4",
            ),
          }}
          name="featured"
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Featured Product</p>
            <p className="text-tiny text-default-600">
              tetapkan produk sebagai produk unggulan
            </p>
          </div>
        </Switch>
        <div className="flex w-full flex-col gap-1">
          <Switch
            isSelected={customizable}
            onValueChange={(isSelected) => {
              setCustomizable(isSelected);
              if (!isSelected) {
                setSelections([]);
                setVariants([]);
              }
            }}
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-foreground-600",
                "data-[selected=true]:border-primary",
              ),
              wrapper: "p-0 h-4 overflow-visible bg-foreground-600",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg border-foreground-600",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4",
              ),
            }}
            name="customizable"
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Customization</p>
              <p className="text-tiny text-default-400">
                jika produk dapat disesuaiakan, maka produk akan ditetapkan
                sebagai pre-order dan memiliki lebih dari satu varian
              </p>
            </div>
          </Switch>
          {state.errors?.variant && (
            <span className="flex flex-col gap-1 text-tiny text-danger">
              {state.errors.variant.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </span>
          )}
          {state.errors?.selections && (
            <span className="flex flex-col gap-1 text-tiny text-danger">
              {state.errors.selections.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </span>
          )}
        </div>
      </div>
      {!customizable ? (
        <>
          <Input
            variant="bordered"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-tiny">Rp</span>
              </div>
            }
            label="Product Price"
            type="number"
            placeholder="Enter Product Price"
            labelPlacement="outside"
            radius="sm"
            name="price"
            errorMessage={
              !!state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p key={error}>{error}</p>
              ))
            }
          />
          <Input
            variant="bordered"
            label="Product Stock"
            type="number"
            placeholder="Enter Product Stock"
            labelPlacement="outside"
            radius="sm"
            name="stock"
            errorMessage={
              !!state.errors?.stock &&
              state.errors.stock.map((error: string) => (
                <p key={error}>{error}</p>
              ))
            }
          />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            <div className="flex gap-3 items-center">
              <span className="text-sm">Variants</span>
              {selections.length === 0 ? (
                <Button
                  onClick={() => setSelections([{ name: "", options: [] }])}
                  isDisabled={selections.length !== 0}
                >
                  Add Variants
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelections([]);
                    setVariants([]);
                  }}
                  isDisabled={selections.length === 0}
                >
                  Remove Variants
                </Button>
              )}
            </div>
            {selections.map((selection, parentKey) => (
              <div
                key={selection.name}
                className="w-full flex flex-col gap-3 items-start"
              >
                <div
                  className={clsx("flex gap-2", {
                    hidden: selection.options.length === 0,
                  })}
                >
                  {selection.options.map((option, index) => (
                    <Chip
                      key={index}
                      onClose={() =>
                        setSelections((prev) =>
                          prev.map((currSel) => {
                            return {
                              ...currSel,
                              options: currSel.options.filter(
                                (currOption) =>
                                  currOption.value !== option.value,
                              ),
                            };
                          }),
                        )
                      }
                      variant="flat"
                    >
                      {!!option.hex_code ? (
                        <div className="flex gap-2">
                          <span
                            className={`block w-4 h-4`}
                            style={{ backgroundColor: option.hex_code }}
                          ></span>
                          <span>{option.value.replaceAll("-", " ")}</span>
                        </div>
                      ) : (
                        option.value.replaceAll("-", " ")
                      )}
                    </Chip>
                  ))}
                </div>
                <div className="w-full flex gap-3 items-start">
                  <Select
                    variant="bordered"
                    label="Variant"
                    labelPlacement="inside"
                    placeholder="Select variant"
                    size="md"
                    selectionMode="single"
                    selectedKeys={
                      selection.name !== ""
                        ? new Set([selection.name])
                        : new Set()
                    }
                    disabledKeys={
                      new Set(
                        selections
                          .filter((sel) => sel.name)
                          .map((sel) => {
                            return sel.name;
                          }),
                      )
                    }
                    classNames={{
                      base: "max-w-xs",
                      trigger: "h-12",
                    }}
                  >
                    {listSelectionType.map((unit) => (
                      <SelectItem
                        onPress={() => {
                          const newValue = selections.map((item, childKey) => {
                            if (parentKey === childKey) {
                              item.name = unit;
                              item.options = [];
                            }
                            return item;
                          });
                          setSelections(newValue);
                        }}
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </SelectItem>
                    ))}
                  </Select>
                  {selection.name === "color" ? (
                    <SelectColors setSelectedColors={setSelections} />
                  ) : null}
                  {selection.name === "material" ? (
                    <InputMaterials setSelectedColors={setSelections} />
                  ) : null}
                </div>
              </div>
            ))}
            {selections.length === 1 ? (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setSelections((prev) => [
                      ...prev,
                      { name: "", options: [] },
                    ])
                  }
                  isDisabled={selections.length !== 1}
                >
                  Add Variants
                </Button>
              </div>
            ) : null}
          </div>
          <div className="w-2/3 rounded-md border-2 border-solid m-auto">
            <div className="flex flex-col gap-3 w-full">
              <span className="p-4">Product Variants</span>
              <div className="flex flex-col gap-3 w-full p-4">
                {variants.map((variant, index) => (
                  <div className="w-full flex flex-col gap-2" key={index}>
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex gap-5 items-center">
                        <span className="text-tiny">Variant</span>
                        <Chip>
                          {variant.variant_name?.replace(/-|_/gi, (matched) => {
                            if (matched === "-") {
                              return " ";
                            }
                            return "/";
                          })}
                        </Chip>
                      </div>
                      <Input
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-tiny">
                              Rp
                            </span>
                          </div>
                        }
                        label="Price"
                        type="number"
                        labelPlacement="outside-left"
                        fullWidth
                        classNames={{
                          base: "gap-6",
                        }}
                        value={variant.price.toString()}
                        onValueChange={(value) => {
                          const numVal = Number(value);
                          handlePriceChange(numVal, index);
                        }}
                        min={1000}
                        errorMessage={
                          variant.price < 1000 && (
                            <p>price must be 1000 or more</p>
                          )
                        }
                      />
                    </div>
                    <Divider className="w-11/12 m-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex justify-end items-center gap-3">
        <Button as={Link} href="/dashboard/products">
          Cancel
        </Button>
        <SubmitButton color="primary">Save</SubmitButton>
      </div>
    </form>
  );
}

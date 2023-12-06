import { fetchProductSoldStats } from '@/app/lib/data';
import { formatMonthAndYearOnly, generateYAxis } from '@/app/lib/utils';
import { FaRegCalendarAlt } from 'react-icons/fa';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function ProductSoldChart() {
  const stat = await fetchProductSoldStats();

  const chartHeight = 350;
  // NOTE: comment in this code when you get to this point in the course

  const { yAxisLabels, topLabel } = generateYAxis(stat);

  if (!stat || stat.length === 0) {
    return <p className='mt-4 text-gray-400'>No data available.</p>;
  }

  return (
    <div className='w-full md:col-span-4'>
      <h2 className='mb-4 text-xl md:text-2xl'>Total Product Sold</h2>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className='rounded-xl bg-gray-50 p-4'>
        <div className='flex justify-between gap-2 items-end rounded-md bg-white p-4 md:gap-4'>
          <div
            className='mb-6 self-start hidden flex-col justify-between text-sm text-gray-400 sm:flex'
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {stat.map((month) => (
            <div key={month.month} className='flex flex-col items-center gap-2'>
              <div
                className='w-full rounded-md bg-blue-300'
                style={{
                  height: `${
                    (chartHeight / topLabel) * month.total_product_sold
                  }px`,
                }}
              ></div>
              <p className='-rotate-90 text-sm text-gray-400 sm:rotate-0'>
                {formatMonthAndYearOnly(new Date(month.month))}
              </p>
            </div>
          ))}
        </div>
        <div className='flex items-center pb-2 pt-6'>
          <FaRegCalendarAlt className='h-5 w-5 text-gray-500' />
          <h3 className='ml-2 text-sm text-gray-500 '>Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}

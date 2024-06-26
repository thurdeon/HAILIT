'use client'
import { useState } from "react"
import OrderSummaryMin from "./OrderSummaryMin"
export type Deliveries = boolean;

export default function OrderHistory () {
    const [currentDeliveries, setCurrentDeliveries] = useState<Deliveries>(true);

    const handleSelectedDeliveries = (status: boolean) => {
      setCurrentDeliveries(status);
    };
    return (
        <div className="flex flex-col md:4/6 w-5/6 mt-4 rounded-2xl gap-2 items-center justify-center">
            <h2 className="font-bold text-xl"> Your Deliveries</h2>
            <div className="flex justify-between items-center w-full md:w-4/6 h-10 bg-white dark:bg-[#1e1e1e] border border-blue-500   rounded-xl p-2 gap-3 text-[13px] mb-4">
              <span
                className={`flex items-center justify-center ${
                  currentDeliveries
                    ? "bg-blue-500 text-white"
                    : " dark:bg-[#1e1e1e] dark:opacity-50"
                }  text-blue-500 dark:text-slate-100 w-1/2 h-8 -ml-1 text-center rounded-lg`}
                onClick={() => handleSelectedDeliveries(true)}
              >
                Current
              </span>
              <span
                className={`flex items-center justify-center ${
                  currentDeliveries
                    ? " dark:bg-[#1e1e1e] dark:opacity-50"
                    : "text-white bg-blue-500"
                } text-blue-500 dark:text-slate-100 w-1/2 h-8 -mr-1 text-center rounded-lg`}
                onClick={() => handleSelectedDeliveries(false)}
              >
                Previous
              </span>
            </div>

            {currentDeliveries && (
              <div className="flex flex-col md:w-5/6 w-full mt-4 rounded-2xl gap-2 items-center justify-center">
                <div className="flex flex-col md:w-5/6 w-full items-center justify-center gap-2 md:items-start md:p-3">

                <OrderSummaryMin deliveryStatus="New Order" packageType="Electronics"/>
                <OrderSummaryMin deliveryStatus="Picked up" packageType="Parcel"/>

                <OrderSummaryMin deliveryStatus="Delivering" packageType="Others"/>
                </div>
              </div>
            )}
            {!currentDeliveries && (
              <div className="flex flex-col md:w-5/6 w-full mt-4 rounded-2xl gap-2 items-center justify-center">
                <div className="flex flex-col md:w-5/6 w-full items-center justify-center gap-2 md:items-start md:p-3">

                <OrderSummaryMin deliveryStatus="Delivered" packageType="Food" />
                <OrderSummaryMin deliveryStatus="Cancelled" packageType="Fragile"/>
                </div>
              </div>
            )}
          </div>
    )
}
import React from 'react';
import { FaPlus, FaDownload, FaUpload } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MdDonutSmall } from "react-icons/md";

const ActionsButton = ({ openModal, exportToExcel, triggerFileInput }) => {
  return (
    <div className="fixed bottom-[100px] right-[20px] z-[1000] flex flex-col items-end">
      <Menu as="div" className="relative">
        <Menu.Button className="text-2xl bg-blue text-white rounded-full p-[10px] hover:bg-white hover:text-blue hover:border-2 hover:border-blue transition ease-in-out delay-30 cursor-pointer">
          <MdDonutSmall 
 size={50} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } group flex rounded-md items-center w-full p-2 text-sm text-gray-900`}
                    onClick={openModal}
                  >
                    <FaPlus className="mr-2" />
                    Add New Query
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } group flex rounded-md items-center w-full p-2 text-sm text-gray-900`}
                    onClick={exportToExcel}
                  >
                    <FaDownload className="mr-2" />
                    Export Excel
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } group flex rounded-md items-center w-full p-2 text-sm text-gray-900`}
                    onClick={triggerFileInput}
                  >
                    <FaUpload className="mr-2" />
                    Import Excel
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <input
        type="file"
        id="excelFileInput"
        style={{ display: 'none' }}
        onChange={(e) => triggerFileInput(e)}
        accept=".xlsx, .xls"
      />
    </div>
  );
};

export default ActionsButton;

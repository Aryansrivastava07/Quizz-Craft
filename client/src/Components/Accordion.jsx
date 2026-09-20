import { react } from 'react'
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function Accordion({ title, isright,idx, children }) {
  return (
    <div className={`w-full mx-auto rounded-2xl shadow dark:shadow-white/20 p-5 m-5 border-2 border-gray-200 dark:border-gray-600 ${isright?"bg-[linear-gradient(to_right,_rgba(0,128,0,.3)_0%,_white_20%)] dark:bg-[linear-gradient(to_right,_rgba(0,128,0,.3)_0%,_#0f1726_20%)]":"bg-[linear-gradient(to_right,_rgba(255,0,0,.3)_0%,_white_20%)] dark:bg-[linear-gradient(to_right,_rgba(255,0,0,.3)_0%,_#0f1726_20%)]"}`} key
    ={idx}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none text-gray-800 dark:text-gray-200">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 transition-transform duration-200 text-gray-600 dark:text-gray-400`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 dark:text-gray-400">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

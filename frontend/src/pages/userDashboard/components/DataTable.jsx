import React from 'react';
import { Link } from 'react-router-dom';

const DataTable = ({
  pageTitle,
  dataListName,
  searchInputPlaceHolder,
  searchKeywordOnSubmitHandler,
  searchKeywordOnChangeHandler,
  searchKeyword,
  tableHeaderTitleList,
  isFetching,
  isLoading,
  data,
  setCurrentPage,
  currentPage,
  headers,
  children,
}) => {
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-2xl leading-tight">{pageTitle}</h2>
          <div className="text-end">
            <form
              onSubmit={searchKeywordOnSubmitHandler}
              className="flex flex-col justify-center items-center gap-2 sm:flex-row"
            >
              <div className="flex bg-gray-50 items-center p-2 rounded-md">
                <input
                  type="text"
                  placeholder={searchInputPlaceHolder}
                  onChange={searchKeywordOnChangeHandler}
                  value={searchKeyword}
                  className="bg-gray-50 outline-none ml-1 block"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {tableHeaderTitleList.map((title, index) => (
                    <th
                      key={index}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={tableHeaderTitleList.length} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaderTitleList.length} className="text-center py-4">
                      No {dataListName} found
                    </td>
                  </tr>
                ) : (
                  children
                )}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {headers?.startIndex} to {headers?.endIndex} of {headers?.totalPosts} {dataListName}
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={headers?.totalPages === currentPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
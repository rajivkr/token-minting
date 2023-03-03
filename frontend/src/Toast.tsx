import { PageOptionsState } from './constants';

const Toast = ({
  pageOptionState,
}: {
  pageOptionState: [
    PageOptionsState,
    React.Dispatch<React.SetStateAction<PageOptionsState>>,
  ];
}) => {
  const [pageOptions, setPageOptions] = pageOptionState;

  return (
    <>
      {pageOptions.showAlert ? (
        <div className="z-50 fixed top-20 right-0 px-4 py-2 rounded-lg bg-green-700 flex flex-col text-base mx-8">
          <div className="pl-1 text-end">
            <button
              onClick={() =>
                setPageOptions({
                  showAlert: false,
                  text: ``,
                  loading: false,
                })
              }
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <p className="text-base ">{pageOptions.text}</p>
        </div>
      ) : null}
    </>
  );
};

export default Toast;

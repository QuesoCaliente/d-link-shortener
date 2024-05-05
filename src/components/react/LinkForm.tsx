import { seoConfig } from "@/utils/seoConfig";
import { useState, type FC } from "react";
import Button from "../ui/Button.astro";

type Status =
  | { type: "none" | "progress" }
  | { type: "success" | "error"; message: string };

export const LinkForm: FC = ({}) => {
  const [status, setStatus] = useState<Status>({ type: "none" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "progress" });
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`${seoConfig.baseURL}api/link`, {
      method: "POST",
      body: formData,
    });

    const data = await response.text();
    if (response.ok) {
      setStatus({ type: "success", message: data });
    } else {
      setStatus({ type: "error", message: data });
    }
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center items-start mt-8 max-w-4xl mx-4 md:mx-auto"
      >
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-start items-center">
          <label
            className="block flex-1 uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="url"
          >
            Url
          </label>
          <input
            type="url"
            id="url"
            name="url"
            className="form-input w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-[15] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="https://www.google.cl"
            required
          />
          <button className="relative h-12 w-full md:w-fit overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 hover:ring-offset-2 active:ring-2 active:ring-neutral-800">
            Shorten
          </button>
        </div>
        <div className="w-full flex flex-col gap-4 sm:flex-row justify-start items-center">
          <label
            className="block uppercase  tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="short"
          >
            slug
          </label>
          <input
            type="text"
            id="short"
            name="short"
            className="form-input w-full md:w-1/3  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="dk2oiu7"
          />
        </div>
        <span id="shorturl">{}</span>
        <StatusComponent status={status} />
      </form>
    </>
  );
};

const StatusComponent = ({ status }: { status: Status }) => {
  switch (status.type) {
    case "none":
      return null;
    case "error":
      return <p className="text-red-300">{status.message}</p>;
    case "progress":
      return <p>Generando...</p>;
    case "success":
      return (
        <div className="flex w-full flex-col justify-center gap-2.5 xs:flex-row xs:items-end">
          <div className="rounded-full bg-light px-5 py-3.5 text-dark">
            <a
              href={`${seoConfig.baseURL}/${status.message}`}
              target="_blank"
              className="decoration-wavy underline-offset-2 selection:bg-dark selection:text-light hover:font-bold hover:italic hover:underline"
            >
              {seoConfig.baseURL}/{status.message}
            </a>
          </div>
        </div>
      );
  }
};

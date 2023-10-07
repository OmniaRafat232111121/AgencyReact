import { useTranslation } from 'react-i18next';

const News = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 lg:px-14 max-w-screen-full mx-auto bg-[#F5F7FA] py-16">
      <div className="flex items-center justify-center mx-auto lg:w-2/6">
        <div className="text-center">
          <h2 className="lg:text-5xl text-3xl text-[#263238] font-semibold mb-6 lg:leading-snug">
            {t('news.title')}
          </h2>
          <div className="flex items-center justify-center gap-8">
            <button className="btn-primary">
              {t('news.getDemo')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                className="inline-block ml-2"
              >
                <path d="M10.2503 7.00012L12.7201 4.53039C13.013 4.23749 13.013 3.7626 12.7201 3.4697L10.2503 0.999966M12.5004 4.00004L1.50012 4.00004" stroke="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;

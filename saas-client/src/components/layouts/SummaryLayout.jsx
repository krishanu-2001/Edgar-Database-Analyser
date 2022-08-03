import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { combineCluster } from '../../utils/utils';

const SummaryLayout = ({ summaryList }) => {
  summaryList = combineCluster(summaryList);

  const color = {
    Positive: ' bg-green-600 ',
    Negative: 'bg-rose-600',
    Neutral: 'bg-blue-700 '
  };
  return (
    <div className=" flex flex-col summary w-full bg-saas-main ml-4 rounded-xl drop-shadow-lg p-6 hover:drop-shadow-xl ">
      <div className="flex flex-row justify-between ">
        <div className="text-xl font-semibold text-saas-accent">Summary</div>
      </div>
      <div className="h-full overflow-y-auto mt-4 ">
        {summaryList.map(({ sentiment, date, sentence }, key) => (
          <div
            key={key}
            className={"text-xs hover:text-sm bg-saas-header scale-95 transition duration-500 hover:scale-100 flex flex-col  text-slate-100 italic    hover:bg-saas-primary hover:text-sky-50 cursor-auto drop-shadow-lg hover:drop-shadow-sm w-full   p-2 my-1 rounded-lg font-semibold cursor-default"}
          >
            <div className="flex flex-row justify-between mb-1">
              
              <div className={`${color[sentiment]} px-3 rounded-lg not-italic`}>
                <FontAwesomeIcon icon={'fa-chart-line'} className='text-lg' />
              </div>
              <div className="px-1 text-slate-100  rounded-lg font-bold 0 not-italic">
                {date.split('-').reverse().join('-')}
              </div>
            </div>
           
            <div className="mt-1 px-2">{sentence}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryLayout;

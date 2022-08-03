import React from 'react';
import { RangeSlider, SliderLabel } from '@progress/kendo-react-inputs';

const RangeScroller = () => {
  return (
    <RangeSlider
      defaultValue={{
        start: 30,
        end: 70
      }}
      step={1}
      min={0}
      max={100}
    >
      {[0, 25, 50, 75, 100].map((perc, i) => (
        <SliderLabel key={i} position={perc}>
          {perc.toString()}
        </SliderLabel>
      ))}
    </RangeSlider>
  );
};

export default RangeScroller;

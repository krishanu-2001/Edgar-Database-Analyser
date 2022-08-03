import React from 'react';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = (props) => {
  const {
    text,
    icon,
    block,
    outline,
    rounded,
    iconClasses,
    className,
    ...nativeProps
  } = props;
  const classes = classnames({
    'btn gap-2 text-base font-lab normal-case disabled:cursor-not-allowed disabled:opacity-50 disabled:text-white/100': true,
    'btn-block': block,
    'btn-outline': outline,
    'rounded-md': rounded,
    [`${className}`]: className
  });
  return (
    <button {...nativeProps} className={classes}>
      {icon && <FontAwesomeIcon icon={icon} className={`${iconClasses}`} />}
      {text}
    </button>
  );
};

export default Button;

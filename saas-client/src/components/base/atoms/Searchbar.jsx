import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { companyList } from '../../../utils/companies';
import Context from '../../../context/context-config';
import Loading from '../atoms/Loading';

import { ErrorBoundary } from 'react-error-boundary';

import { getCompanyDataFromCIK } from '../../../utils/utils';
import Button from '@/components/base/atoms/Button';

export default function AnimatedMulti({ style_prop }) {
  const [companyCIKs, setCompanyCIKs] = useState([]);
  const myContext = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleInputChange = async (e) => {
    if (e.length === 0) {
      navigate('/app');
      return;
    }
    const companiesCIK = e.map((company) => company.value);
    setCompanyCIKs(companiesCIK);
    try {
      const promise = [];
      companiesCIK.forEach((cik) => {
        promise.push(getCompanyDataFromCIK(`${cik}`));
      });
      console.log('promise', promise);
      const companies = await Promise.all(promise);
      console.log('comp', companies);
      myContext.setSelectedCompanies(companies);
      setLoading(false);
    } catch (err) {
      console.log(err);
      navigate('/app');
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      ...style_prop,
      borderRadius: '20px !important',
      background: '#ffffff',
      // border: '0px!important',
      width: style_prop ? style_prop.width : '200px',

      // boxShadow: 'none',
      border: '1px solid black',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid black'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#3547ac'
    }),
    input: (provided) => ({
      ...provided,
      color: '#000000'
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected
        ? '#6A31FF'
        : state.isFocused
        ? '#3547AC'
        : '#F2F5FF',
      color: state.isFocused ? '#ffffff' : '#301772'
    }),
    menu: (provided) => ({
      ...provided,
      background: '#ffffff',

      color: '#152033'
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#ffffff'
    }),

    ':before': {
      borderRadius: 0,
      outline: 0,
      backgroundColor: 'transparent',
      boxShadow: 'none'
    }
  };

  const Placeholder = () => {
    return (
      <div className="flex items-center flex-row justify-items-start gap-x-2 ">
        <FontAwesomeIcon icon={'search'} />
        Company
      </div>
    );
  };

  function ErrorFallback({ error, resetErrorBoundary }) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
        setCompanyCIKs([]);
      }}
    >
      <div className="flex flex-col p-1">
        <Select
          placeholder={<Placeholder />}
          label="Single select"
          isSearchable={true}
          onChange={(e) => {
            handleInputChange(e);
          }}
          styles={customStyles}
          isMulti
          noOptionsMessage={() => 'No company in the database'}
          className="text-center font-bold text-white border-0 focus:ring-0"
          isClearable
          backspaceRemovesValue
          options={companyList}
          autoFocus={true}
          on
        />
        {companyCIKs.length > 0 ? (
          <Button
            text="View Charts"
            type="primary"
            onClick={() => {
              navigate('/charts');
            }}
          />
        ) : null}
        {loading && <Loading />}
      </div>
    </ErrorBoundary>
  );
}

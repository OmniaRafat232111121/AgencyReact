

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keywordschema } from '../utils/validation';
import { toast } from 'react-toastify';
import axios from 'axios';

const KeywordForm = ({ onAddQuery }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(keywordschema),
  });

  const token = localStorage.getItem('token');

  const onSubmit = async (data) => {
    try {
      const payload = {
        query: data.keywords,
        target_url: data.url,
      };
      const csrfToken = csrfToken();

      const response = await axios.post('${process.env.REACT_APP_API_URL}/api/add-rank/', payload, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`

        },
      });

      onAddQuery(response.data);  
      toast.success('Query added successfully!');
    } catch (error) {
      console.error('API error:', error.response ? error.response.data : error.message);
      toast.error('Failed to add the query.');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto">
      <h1 className="mt-3 font-bold text-center text-darkblue">Add new Query</h1>
      <div className="mb-4">
        <label htmlFor="keywords" className="block text-gray-600">
          Keyword(s)
        </label>
        <Controller
          name="keywords"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <textarea
                {...field}
                id="keywords"
                className={`w-full border p-2 ${
                  errors.keywords ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.keywords && (
                <p className="mt-1 text-red-500">{errors.keywords.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-600">
          URL
        </label>
        <Controller
          name="url"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <input
                {...field}
                type="text"
                id="url"
                className={`w-full border p-2 ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.url && <p className="mt-1 text-red-500">{errors.url.message}</p>}
            </>
          )}
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 mb-3 text-white rounded bg-blue hover:bg-blue"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default KeywordForm;
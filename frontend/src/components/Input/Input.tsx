import { FC, InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
}

const Input: FC<InputProps> = ({ className = '', inputRef, ...props }) => {
  const baseStyles =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const combinedStyles = `${baseStyles} ${className}`;

  return <input ref={inputRef} className={combinedStyles} {...props} />;
};

export default Input;

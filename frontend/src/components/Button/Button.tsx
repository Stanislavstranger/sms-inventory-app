import { FC, ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon } from '..';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconName?: 'edit' | 'delete';
}

const Button: FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  iconName,
  ...props
}) => {
  const baseStyles =
    'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer';

  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
  };

  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <button className={combinedStyles} {...props}>
      {iconName && <Icon name={iconName} className={children ? 'mr-2' : ''} />}
      {children}
    </button>
  );
};

export default Button;

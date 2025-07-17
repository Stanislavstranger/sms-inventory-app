import { FC, SVGProps, lazy, Suspense } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: 'edit' | 'delete';
}

const EditIcon = lazy(() => import('./assets/EditIcon'));
const DeleteIcon = lazy(() => import('./assets/DeleteIcon'));

const Icon: FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = (() => {
    switch (name) {
      case 'edit':
        return EditIcon;
      case 'delete':
        return DeleteIcon;
      default:
        return null;
    }
  })();

  if (!IconComponent) {
    return null;
  }

  return (
    <Suspense fallback={<div></div>}>
      <IconComponent {...props} />
    </Suspense>
  );
};

export default Icon;

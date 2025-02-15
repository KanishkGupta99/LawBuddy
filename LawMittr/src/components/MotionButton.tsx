import { Button, ButtonProps } from '@mui/material';
import { motion, MotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type MotionButtonProps = ButtonProps & {
  to?: LinkProps['to'];
  component?: any;
};

const MotionButton = motion(
  forwardRef<HTMLButtonElement, MotionButtonProps>((props, ref) => <Button {...props} ref={ref} />)
);

export default MotionButton;

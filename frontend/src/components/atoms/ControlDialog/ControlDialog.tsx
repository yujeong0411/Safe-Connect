// // src/components/atoms/ControlDialog/ControlDialog.tsx
// import * as React from 'react';
// import * as DialogPrimitive from '@radix-ui/react-dialog';
// import { cn } from '@/utils/cn';

// const ControlDialog = DialogPrimitive.Root;
// const ControlDialogTrigger = DialogPrimitive.Trigger;
// const ControlDialogPortal = DialogPrimitive.Portal;

// const ControlDialogOverlay = React.forwardRef<
//   React.ElementRef<typeof DialogPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <DialogPrimitive.Overlay
//     ref={ref}
//     className={cn(
//       'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
//       className
//     )}
//     {...props}
//   />
// ));
// ControlDialogOverlay.displayName = "ControlDialogOverlay";

// const ControlDialogContent = React.forwardRef<
//   React.ElementRef<typeof DialogPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
// >(({ className, children, ...props }, ref) => (
//   <ControlDialogPortal>
//     <ControlDialogOverlay />
//     <DialogPrimitive.Content
//       ref={ref}
//       className={cn(
//         'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 rounded-lg',
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </DialogPrimitive.Content>
//   </ControlDialogPortal>
// ));
// ControlDialogContent.displayName = "ControlDialogContent";

// export { ControlDialog, ControlDialogTrigger, ControlDialogContent };

// src/components/atoms/ControlDialog/ControlDialog.tsx
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../../utils/cn';

const ControlDialog = DialogPrimitive.Root;
const ControlDialogTrigger = DialogPrimitive.Trigger;
const ControlDialogPortal = DialogPrimitive.Portal;

const ControlDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
ControlDialogOverlay.displayName = 'ControlDialogOverlay';

const ControlDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ControlDialogPortal>
    <ControlDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </ControlDialogPortal>
));
ControlDialogContent.displayName = 'ControlDialogContent';

export { ControlDialog, ControlDialogTrigger, ControlDialogContent };

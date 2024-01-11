import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// The <dialog> element can also be closed by pressing the ESC key on the keyboard.
// In that case, the dialog will disappear but the state passed to the
// open prop (i.e., the modalIsOpen state) will not be set to false.
//Therefore, the modal can't be opened again (because modalIsOpen still is true -
// the UI basically now is not in sync with the state anymore).
//To fix this issue, we must listen to the modal being closed by adding the built-in
// onClose prop to the <dialog>. The event is then "forwarded" to the App component by
// accepting a custom onClose prop on the Modal component.

// In the below code we require use effect as the code inside the use effect uses
// dialog ref, and if we don't use use effect, then the dialog ref would be null
// as the dialog ref would be set only after the component is rendered and not
// before that. So, we need to use use effect to set the dialog ref after the
// component is rendered.

// The dependecy array of useEffect is used to tell react to run the callback
// function inside the useEffect only when the value of the dependency array
// changes. If the dependency array is empty, then the callback function inside
// the useEffect will run only once after the component is rendered for the first
// time. If the dependency array is not empty, then the callback function inside
// the useEffect will run only when the value of the dependency array changes.
// Typically, we would want to write the state and prop values which are used
// inside the callback function of the useEffect in the dependency array as these
// values are likely to change during the component lifecycle. If we don't write
// these values in the dependency array, then the callback function inside the
// useEffect will not run when the value of these values changes.

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open && children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;

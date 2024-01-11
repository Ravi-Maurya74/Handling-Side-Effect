import React, { useEffect } from "react";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = React.useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 10);
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("Timer Set");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    // The return statement of the useEffect callback function is used to
    // clean up the side effects of the useEffect callback function.
    // Is is executed when the component is unmounted or when the dependency
    // array of the useEffect changes, the clean up is run before running
    // the useEffect callback function again.

    // Here we need to clear the timer when the component is unmounted, as
    // otherwise the timer will continue to run even after the component is
    // unmounted when we click on no button. This is because the timer is
    // still running. So our image will be deleted after clicking on no button.

    return () => {
      console.log("Timer Cleared");
      clearTimeout(timer);
    };
  }, []);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress max={TIMER} value={remainingTime} />
    </div>
  );
}

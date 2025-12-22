import { useState, useEffect, useRef, useCallback } from "react";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 10000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
    toastTimeouts.delete(toastId);
  }
};

export const reducer = (state, action) => {
  console.log('Toast Action:', action);
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners = [];
let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

const createToast = (id) => {
  const toast = (props) => {
    const onOpenChange = (open) => {
      if (!open) {
        // First update the local state to trigger the close animation
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { id, open: false }
        });
        // Then schedule the actual removal
        setTimeout(() => {
          dispatch({ 
            type: actionTypes.REMOVE_TOAST, 
            toastId: id 
          });
        }, 300); // Match this with your CSS transition duration
      }
    };

    const update = (newProps) => {
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...newProps, id },
      });
    };

    const dismiss = () => {
      onOpenChange(false);
    };

    // Clear any existing timeout for this toast
    clearFromRemoveQueue(id);

    // Add the toast
    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange,
      },
    });

    // Set up auto-dismissal
    if (props.duration !== Infinity) {
      const timeout = setTimeout(() => {
        dismiss();
      }, props.duration || TOAST_REMOVE_DELAY);
      
      return {
        id,
        dismiss,
        update,
        _timeout: timeout, // Keep track of the timeout
      };
    }

    return {
      id,
      dismiss,
      update,
    };
  };

  return toast;
};

const toast = (props) => {
  const id = genId();
  const toastInstance = createToast(id)(props);
  
  // Return a wrapper that cleans up timeouts on unmount
  return {
    ...toastInstance,
    dismiss: () => {
      if (toastInstance._timeout) {
        clearTimeout(toastInstance._timeout);
      }
      toastInstance.dismiss();
    }
  };
};


function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const dismiss = useCallback((toastId) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, []);

  return {
    ...state,
    toast,
    dismiss,
  };
}

export { useToast, toast };
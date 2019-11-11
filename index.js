import {useState, useEffect, useRef} from 'react'

function useAutorun(f) {
  const [result, setResult] = useState(undefined);
  const compContainer = useRef(undefined);

  useEffect(() => {
    if (!compContainer.current) {
      compContainer.current = Tracker.autorun(computation => {
        const output = f(computation);
        setResult(output);
      });
    }
    return () => compContainer.current.stop();
  }, []);

  return result;
}

export {useAutorun};

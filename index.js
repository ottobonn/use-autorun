const EJSON = require('ejson');
const {useState, useEffect, useRef} = require('react');

function useAutorun(f) {
  const [result, setResult] = useState(undefined);
  const compContainer = useRef(undefined);

  useEffect(() => {
    // this effect has no body; it is just for the cleanup hook
    return () => {
      compContainer.current.stop();
    };
  }, []);

  if (!compContainer.current) {
    let firstResult;
    compContainer.current = Tracker.autorun(computation => {
      const output = f(computation);
      if (computation.firstRun) {
        // On the first run, we want the output synchronously because the
        // surrounding component is in the process of rendering. setResult will
        // only make the result availabe on the next render, so we use the
        // output directly here.
        firstResult = output;
      } else {
        // For every run but the first, we need to trigger the surrounding
        // component to render again, so we call setResult.
        setResult(output);
      }
    });
    return firstResult;
  }

  return result;
}

function useReactive(value, equals=EJSON.equals) {
  const container = useRef(undefined);

  if (!container.current) {
    const rv = new ReactiveVar(value, equals);
    container.current = {
      rv,
      getter() {
        // We expose just the get() method of the reactive variable because
        // setting it would not cause the surrounding component to rerender.
        return rv.get();
      }
    };
  }

  container.current.rv.set(value);
  return container.current.getter;
}

module.exports = {useAutorun, useReactive};

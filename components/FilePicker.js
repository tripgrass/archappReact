import {useRef} from 'react';

export default function FilePicker (props) {
  const { onChange } = props;
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };



  return (
    <div>
      <input
        style={{display: 'none'}}
        ref={inputRef}
        type="file"
        onChange={onChange}
      />

      <button onClick={handleClick}>Open file upload box</button>
    </div>
  );
};
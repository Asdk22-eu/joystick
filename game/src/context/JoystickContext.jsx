import React, { createContext, useState, useEffect } from "react";

export const JoystickContext = createContext(null);

const JoystickProvider = ({ children }) => {
  const [joystickData, setJoystickData] = useState({ x: 0, y: 0, button: 0 });
  const [port, setPort] = useState(null);

  const connectJoystick = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        try {
          const parsedData = JSON.parse(value.trim());
          setJoystickData(parsedData);
        } catch (err) {
          console.error("Error al parsear datos:", err);
        }
      }
    } catch (err) {
      console.error("Error al conectar el joystick:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (port) port.close();
    };
  }, [port]);

  return (
    <JoystickContext.Provider value={{ joystickData, connectJoystick }}>
      {children}
    </JoystickContext.Provider>
  );
};

export default JoystickProvider;

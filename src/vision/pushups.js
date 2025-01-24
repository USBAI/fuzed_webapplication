import React, { useState, useRef, useEffect, useCallback } from 'react';

const ModelXy = () => {
  const [pushUpCount, setPushUpCount] = useState(0);
  const [milestoneReached, setMilestoneReached] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [buttonText, setButtonText] = useState('Start Push-Ups');
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [frameLogs, setFrameLogs] = useState([]); 
  const [successLogs, setSuccessLogs] = useState([]);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/movementdetection/pushupmodel/');
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setFrameLogs((prevLogs) => [...prevLogs, `Response: ${JSON.stringify(data)}`]);
      if (data.error) {
        console.error('Error from server:', data.error);
      } else {
        setPushUpCount(data.count);
        setSuccessLogs((prevLogs) => [...prevLogs, `Push-Up ${data.count}: Frames processed successfully.`]);
        if (data.count > 0 && data.count % 10 === 0) {
          setMilestoneReached(true);
          setTimeout(() => setMilestoneReached(false), 5000);
        }
      }
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  const sendFrameOverSocket = useCallback(
    (frame) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const frameData = { frame: frame || null };
        socket.send(JSON.stringify(frameData)); 
        setFrameLogs((prevLogs) => [...prevLogs, `Request: ${JSON.stringify(frameData)}`]);
      }
    },
    [socket]
  );

  const startPushUpCounter = () => {
    if (buttonText === 'Start Push-Ups') {
      setButtonText('Go Live');
      connectWebSocket(); 
      return;
    } else if (buttonText === 'Go Live') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            setStreaming(true);
            mediaStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const sendFrame = () => {
              if (!streaming || !videoRef.current) return;

              const video = videoRef.current;
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              const frame = canvas.toDataURL('image/jpeg').split(',')[1];
              sendFrameOverSocket(frame);

              setTimeout(sendFrame, 1000);
            };

            sendFrame();
          })
          .catch((err) => {
            console.error('Error accessing the camera: ', err);
          });
      } else {
        console.error('getUserMedia not supported in this browser.');
      }
      setButtonText('End');
    } else if (buttonText === 'End') {
      alert('Ending live session...');
      setStreaming(false);
      setButtonText('Start Push-Ups');

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (socket) {
        socket.close();
      }
    }
  };

  useEffect(() => {
    let animationFrameId;

    if (streaming) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const sendFrame = () => {
        if (!videoRef.current || !streaming) return;

        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = canvas.toDataURL('image/jpeg').split(',')[1];
        sendFrameOverSocket(frame); 

        animationFrameId = requestAnimationFrame(sendFrame);
      };

      sendFrame();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [streaming, sendFrameOverSocket]);

  useEffect(() => {
    const frameLogsDiv = document.getElementById('frame-logs');
    const successLogsDiv = document.getElementById('success-logs');

    if (frameLogsDiv) frameLogsDiv.scrollTop = frameLogsDiv.scrollHeight;
    if (successLogsDiv) successLogsDiv.scrollTop = successLogsDiv.scrollHeight;
  }, [frameLogs, successLogs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '90%' }}>
      {streaming && (
        <div style={{ padding: '10px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'red',
              padding: '10px 20px',
              background: 'linear-gradient(to bottom right, #E1F9FF, #FFE8CC)',
            }}
          >
            <div style={{ color: 'red', marginRight: '10px', animation: 'pulse 1s infinite' }}>●</div>
            <div>Live</div>
          </div>
        </div>
      )}

      <button
        onClick={startPushUpCounter}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginBottom: '20px',
          borderStyle: 'none',
          borderRadius: '500px',
          backgroundColor: '#007bff',
          background: 'linear-gradient(to bottom right, #E1F9FF, #FFE8CC)',
          color: 'black',
          cursor: 'pointer',
        }}
      >
        {buttonText}
      </button>

      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(to bottom right, #E1F9FF, #FFE8CC)',
          width: '80%',
          height: '480px',
          borderRadius: '20px',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderStyle: 'none',
            borderRadius: '10px',
          }}
        ></video>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            backgroundColor: 'rgba(88, 88, 88, 0.5)',
            padding: '5px 10px',
            borderRadius: '10px',
            fontSize: '18px',
          }}
        >
          Push-Ups: {pushUpCount}
        </div>
        {milestoneReached && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            🎉 Congrats! You’ve reached {pushUpCount} Push-Ups! 🎉
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            id="frame-logs"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              height: '180px',
              background: 'black',
              borderRadius: '10px',
              padding: '10px',
              color: 'lime',
              fontFamily: 'monospace',
              overflowY: 'auto',
            }}
          >
            <h4 style={{ color: 'white', marginBottom: '10px' }}>Frame Logs</h4>
            {frameLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>

          <div
            id="success-logs"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              height: '180px',
              background: 'black',
              borderRadius: '10px',
              padding: '10px',
              color: 'lime',
              fontFamily: 'monospace',
              overflowY: 'auto',
            }}
          >
            <h4 style={{ color: 'white', marginBottom: '10px' }}>Success Logs</h4>
            {successLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelXy;
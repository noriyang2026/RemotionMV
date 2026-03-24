import wave
import contextlib

fname = r"c:\Users\noriy\Desktop\WATSON\RemotionMV\public\assets\蜘蛛ノ糸.wav"
with contextlib.closing(wave.open(fname,'r')) as f:
    frames = f.getnframes()
    rate = f.getframerate()
    duration = frames / float(rate)
    print(f"Duration: {duration} seconds")
    print(f"Frames (30fps): {duration * 30}")

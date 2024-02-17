from moviepy.editor import *
import numpy as np
import os


class VideoConverter:

    def zoom_in_out(self, t):

        return 1.3 + 0.3 * np.sin(t / 3)


    def create_video(self):
        '''#reading stored images
        image_folder='C:/ChatHub/chatgenhub/backend/images'
        image_files = sorted(
            [
                os.path.join(image_folder, img)
                for img in os.listdir(image_folder)
                if img.endswith(".png")
            ]
        )
        print(image_files)

        #reading stored audio file
        audio_folder='C:/ChatHub/chatgenhub/backend/audio'
        audio_file = os.path.join(audio_folder, "result.wav")
        audio = AudioFileClip(audio_file)
        audio_duration = audio.duration
        print(audio_duration)

        #clip generation
        image_duration = audio_duration / len(image_files) # Calculate duration for each image

        clips = []
        height = 1280
        width = 720
        for i in range(len(image_files)):
            print("processing image", i)
            clip = ImageClip(image_files[i]).set_duration(image_duration)
            clip = clip.resize((width, height))
            clip = clip.resize(self.zoom_in_out)
            clips.append(clip)

        #concatenating the clips
        print("concatenating")
        video_clip = concatenate_videoclips(clips, method="compose")
        video_clip = video_clip.set_audio(audio)

        print(video_clip.duration)
        print("writing")
        video_clip.write_videofile(
            'C:/ChatHub/chatgenhub/backend/videos/video.mp4',
            fps=24,
            threads=8,
            audio=True,
            codec="libx264",
            audio_codec="aac",
        )
        print('writing finished')'''

        
        path='C:/ChatHub/chatgenhub/backend/videos/video.mp4'
        return path


import MuxPlayer from '@mux/mux-player-react';

export default function MuxVideoPlayer({playbackId}: {playbackId: string}) {
  return (
    <MuxPlayer
      streamType="on-demand"
      autoPlay="muted"
      playsinline={true}
      loop={true}
      thumbnailTime={0}
      controls={false}
      secondaryColor="rgba(0, 0, 0, 0)"
      playbackId={playbackId}
    />
  );
}

// screens/VideoPlayerScreen.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { RouteProp } from '@react-navigation/native';

type VideoPlayerScreenRouteProp = RouteProp<{ params: { videoId: string; title: string } }, 'params'>;

const VideoPlayerScreen = ({ route }: { route: VideoPlayerScreenRouteProp }) => {
  const { videoId, title } = route.params;

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={300}
        videoId={videoId}
        play={true}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16
  }
});

export default VideoPlayerScreen;
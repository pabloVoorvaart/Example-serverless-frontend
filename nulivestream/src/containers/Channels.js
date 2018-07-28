import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Grid, PageHeader } from "react-bootstrap";
import { Player } from 'video-react';
import VideoPlayer from "../components/VideoPlayer";
import "../../node_modules/video-react/dist/video-react.css";

export default class Channels extends Component {
  constructor(props) {
    super(props);

    this.logo_image = null;
    this.poster_iamge = null;

    this.state = {
      isLoading: true,
      channel: null,
      name: "",
      logoURL: null,
      posterURL: null,
      status: 'IDLE'
    };
  }

  async componentDidMount() {
    try {
      let logoURL;
      let posterURL;

      const channel = await this.getChannel();
      console.log(channel)
      const { logo_image, poster_image } = channel;

      if (logo_image) {
        logoURL = await Storage.vault.get(logo_image);
    }
      if (poster_image) {
        posterURL = await Storage.vault.get(poster_image);
      }

      this.setState({
        channel: channel,
        logoURL,
        posterURL,
        isLoading: false
      });
    } catch (e) {
       console.log(e);
    }
  }

  getChannel() {
    return API.get("channel", `/channel/${this.props.match.params.id}`);
  }

  renderVideoPlayer(channel){
      const videoOptions = {
        isVideoChild: true,
        // src: 'https://'+server.cdn_adress+'/'+channel.streamkey+'/'+channel.streamkey+'.m3u8',
        src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanc8",
        type: "application/x-mpegURL",
      }

      return (
          <Player ref="player" poster={this.state.posterURL}>
            <VideoPlayer { ...videoOptions } />
          </Player>
      );
  }

  renderChannel(){
      return(
      <Grid>
      <PageHeader>{this.state.channel.name}</PageHeader>
          <div className="channel_player">
            {this.renderVideoPlayer(this.state.channel)}
          </div>
      </Grid>
      );
  }

  render() {
    return (
      <div className="channels">
        <div>
          {!this.state.isLoading && this.renderChannel()}
        </div>
      </div>
    );
  }
}

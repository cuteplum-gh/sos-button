// React Component
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import io from 'socket.io-client';

import englishText from './en.json';
import chineseText from './zh.json';

class SendC extends Component {
  constructor(props) {
    super(props);
    this.state = {  // *****
      uName: '',
      uPhone: '',
      uAdd: '',
      uEName: '',
      uEPhone: '',
      location: null,
      error: null,
      isSOSButtonDisabled: true,
      sosButtonMessage: chineseText.sosButtonLabel,
      language: 'zh', // Default language is Chinese
      texts: chineseText, // Initial language texts
    };
    this.socket = io('http://localhost:3001'); // 請替換成你的伺服器地址
  }

  sendMessage = () => {
    if(this.state.location==null){
      var lat=null;
      var lon=null;
    }else{
      var lat=this.state.location.latitude;
      var lon=this.state.location.longitude;
    }
    this.socket.emit('send_message', {  // *****
      uName: this.state.uName,
      uPhone: this.state.uPhone,
      uAdd: this.state.uAdd,
      uEName: this.state.uEName,
      uEPhone: this.state.uEPhone,
      latitude: lat,
      longitude: lon,
    });
    this.setState({
      sosButtonMessage: this.state.texts.sosButtonMessage_sent,
    });
  };

  componentDidMount() {  // *****

    var sosMsg;

    sosMsg = Cookies.get('uName');
    if (sosMsg) {
      this.setState({ uName: sosMsg });
    }

    sosMsg = Cookies.get('uPhone');
    if (sosMsg) {
      this.setState({ uPhone: sosMsg });
    }

    sosMsg = Cookies.get('uAdd');
    if (sosMsg) {
      this.setState({ uAdd: sosMsg });
    }

    sosMsg = Cookies.get('uEName');
    if (sosMsg) {
      this.setState({ uEName: sosMsg });
    }

    sosMsg = Cookies.get('uEPhone');
    if (sosMsg) {
      this.setState({ uEPhone: sosMsg });
    }

    sosMsg = Cookies.get('language');
    this.toggleLanguage(sosMsg);

    if (!navigator.geolocation) {
      this.setState({ error: 'Geolocation is not supported by your browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (err) => {
        this.setState({ error: `Error retrieving location: ${err.message}` });
      }
    );
  }

  handleChange = (e, field, cookieName) => {
    const v = e.target.value;
    this.setState({ [field]: v });
    Cookies.set(cookieName, v, { expires: 9999 });
  };

  handleNameOrPhoneChange = () => {
    const { uName, uEPhone } = this.state;
    const isDisabled = uName.trim() === '' || uEPhone.trim() === '';
    const message = isDisabled ? this.state.texts.sosButtonMessage_fill : this.state.texts.sosButtonMessage_sos;
    this.setState({
      isSOSButtonDisabled: isDisabled,
      sosButtonMessage: message,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if uName or uEPhone has changed
    if (this.state.uName !== prevState.uName || this.state.uEPhone !== prevState.uEPhone) {
      this.handleNameOrPhoneChange();
    }
  }

  toggleLanguage = (selectedLanguage) => {
    let newTexts;
    let newLanguage = selectedLanguage;

    switch (selectedLanguage) {
      case 'zh':
        newTexts = chineseText;
        break;
      case 'en':
        newTexts = englishText;
        break;
      default:
        newTexts = chineseText;
        newLanguage = 'zh';
      // Default to Chinese if the language is not recognized
      // Add more cases for additional languages if needed
    }

    this.setState({  //  using a callback function to perform actions after the state change has been applied
      language: newLanguage,
      texts: newTexts,
    }, () => {
      this.handleNameOrPhoneChange();
      Cookies.set('language', this.state.language, { expires: 9999 });
    });
  };


  render() {
    const { location, error, isSOSButtonDisabled, sosButtonMessage, texts } = this.state;
    return (
      <div>
        <h1>{texts.sosButtonLabel}</h1>
        <div>
          <select onChange={(e) => this.toggleLanguage(e.target.value)} value={this.state.language}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select><br />
          <button onClick={this.sendMessage} disabled={isSOSButtonDisabled}>
            {sosButtonMessage}
          </button><br />
          <label>{texts.nameLabel}</label>
          <input
            type="text"
            value={this.state.uName}
            onChange={(e) => this.handleChange(e, 'uName', 'uName')}
          />
          <br />
          <label>{texts.phoneLabel}</label>
          <input
            type="text"
            value={this.state.uPhone}
            onChange={(e) => this.handleChange(e, 'uPhone', 'uPhone')}
          />
          <br />
          <label>{texts.addressLabel}</label>
          <input
            type="text"
            value={this.state.uAdd}
            onChange={(e) => this.handleChange(e, 'uAdd', 'uAdd')}
          />
          <br />
          <label>{texts.emergencyNameLabel}</label>
          <input
            type="text"
            value={this.state.uEName}
            onChange={(e) => this.handleChange(e, 'uEName', 'uEName')}
          />
          <br />
          <label>{texts.emergencyPhoneLabel}</label>
          <input
            type="text"
            value={this.state.uEPhone}
            onChange={(e) => this.handleChange(e, 'uEPhone', 'uEPhone')}
          />
          <br />
          {location ? (
            <p>{texts.locationLabel}: {location.latitude}, {location.longitude}</p>
          ) : (
            <p>{error || texts.loadingLocation}</p>
          )}
        </div>
        <p>{texts.cookieMessage}</p>
      </div>
    );
  }
}

export default SendC;
// https://sv443.net/jokeapi/v2/
class AskChadBotForAJokeRewardHandler {
  static _$container = $();
  static _jokeIntroDelay = 500;
  static _jokeEndingDelay = 5000;
  static _jokeIntros = [
    'Hey, here\'s a joke:',
    'Let me tell you a joke:',
    'Dude, hear this:',
    'I just remembered this joke:',
    'I bet I can make you laugh with this joke:',
    'Hey!',
  ];

  static async run() {
    const jokeIntroIndex = Math.round(Math.random() * (this._jokeIntros.length - 1));
    const jokeIntro = this._jokeIntros[jokeIntroIndex];
    const joke = await this._fetchRandomJoke();

    this._displayJoke(joke);
    await this._speak(jokeIntro);
    await this._delay(this._jokeIntroDelay);
    await this._speak(joke);
    await this._delay(this._jokeEndingDelay);
    this._hideJoke();
  }

  static _hideJoke() {
    this._$container.fadeOut(
      'slow',
      () => this._$container.remove(),
    );
  }

  static _delay(delayTime) {
    return new Promise((resolve) => {
      setTimeout(resolve, delayTime);
    });
  }

  static _displayJoke(joke) {
    const jokeWithBreaks = joke.replace('\n', '<br />');
    this._$container = $(`
      <div class="reward__ask-chad-bot-for-a-joke">
        <div class="avatar">
          <img src="/overlays/ask-chad-bot-for-a-joke/assets/chad-bot.png" />
        </div>
        <div class="joke">
          ${jokeWithBreaks}
        </div>
      </div>
    `);

    this._$container
      .hide()
      .appendTo('body')
      .fadeIn('slow');
  }

  static async _speak(textMessage) {
    return new Promise((resolve) => {
      const speech = new SpeechSynthesisUtterance();
      speech.text = textMessage;
      speech.onend = () => resolve();

      window.speechSynthesis.speak(speech);
    });
  }

  static async _fetchRandomJoke() {
    const response = await fetch('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,racist,sexist,explicit');
    const jokeData = await response.json();

    if (jokeData.type === 'twopart') {
      return `${jokeData.setup}\n\n${jokeData.delivery}`;
    } else {
      return jokeData.joke;
    }
  }
}

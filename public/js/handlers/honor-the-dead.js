class HonorTheDeadRewardHandler {
  static isRunning = false;
  static audio = new Audio('/assets/rest-in-peace.mp3');
  static tombImg = '<img class="rewards__tomb" src="/assets/tomb.png" />';
  static $container = null;
  static messages = [
    'Pays their respect.',
    'Pressed F.',
    'Salutes the fallen hero.',
    'Sobbed a little.',
    'Will always remember.',
  ];

  static runUserAnimation(data) {
    const randomNumber = Math.round(Math.random() * 5) + 1;
    const avatar = `<img src="/assets/respect-avatars/respect${randomNumber}.jpg" />`;
    const randomMessageNumber = Math.round(Math.random() * (this.messages.length - 1));
    const message = this.messages[randomMessageNumber];

    this.$container.find('.reward__user-details').hide();
    $(`
      <div class="reward__user-details">
        ${avatar}
        <h1>${data.userDisplayName}</h1>
        <p>${message}</p>
      </div>
    `)
      .hide()
      .appendTo(this.$container)
      .fadeIn('slow')
      .delay(30_000)
      .fadeOut('fast');
  }

  static run(data) {
    if (this.isRunning) {
      this.runUserAnimation(data);
      return;
    }

    this.isRunning = true;
    this.$container = $('<div class="reward__honor-the-dead"></div>');
    ws.send(JSON.stringify({
      type: 'change-light',
       value: {
        color: [255, 0, 0],
        brightness: 0,
        duration: 3_000,
      },
    }));

    this.audio.volume = 0.5;
    this.audio.currentTime = 0;
    this.audio.play();

    this.$container
      .append(this.tombImg)
      .appendTo('body');

    this.runUserAnimation(data);

    setTimeout(
      () => {
        $(this.audio)
          .animate(
            {
              volume: 0,
            },
            'slow',
            () => this.audio.pause(),
          );
        this.$container
          .fadeOut('slow', () => this.$container.remove());
        ws.send(JSON.stringify({
          type: 'change-light',
          value: {
            color: [255, 255, 0],
            brightness: 1,
            duration: 3_000,
          },
        }));
        this.isRunning = false;
      },
      30_000
    );
  }
}

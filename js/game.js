
// ����������ֵı���
var storageScore = 0;
// ���������ֵܷı���
var globalScore = 0;
// ��Ϸ��Ҫ�����߼�
class Game {
  constructor (main) {
    let g = {
      main: main,                                                   // ��Ϸ������
      actions: {},                                                  // ��¼��������
      keydowns: {},                                                 // ��¼����keycode
      state: 1,                                                     // ��Ϸ״ֵ̬����ʼĬ��Ϊ1
      state_START: 1,                                               // ��ʼ��Ϸ
      state_RUNNING: 2,                                             // ��Ϸ��ʼ����
      state_STOP: 3,                                                // ��ͣ��Ϸ
      state_GAMEOVER: 4,                                            // ��Ϸ����
      state_UPDATE: 5,                                              // ��Ϸͨ��
      canvas: document.getElementById("canvas"),                    // canvasԪ��
      context: document.getElementById("canvas").getContext("2d"),  // canvas����
      timer: null,                                                  // ��ѯ��ʱ��
      fps: main.fps,                                                // ����֡����Ĭ��60
    }
    Object.assign(this, g)
  }
  // ����ҳ�������ز�
  draw (paddle, ball, ballshadow, blockList, score) {
    let g = this
    // �������
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    // ���Ʊ���ͼ
    // g.drawBg()
    // ���Ƶ���
    g.drawImage(paddle)
    // ����С��
    g.drawImage(ball)
	// ����С����Ӱ
    g.drawImage(ballshadow)
    // ����ש��
    g.drawBlocks(blockList)
    // ���Ʒ���
    g.drawText(score)
	window.canvas_g = this
  }
  // ����ͼƬ
  drawImage (obj) {
    this.context.drawImage(obj.image, obj.x, obj.y)
  }
  // ���Ʊ���ͼ
  drawBg () {
    let bg = imageFromPath(allImg.background)
    this.context.drawImage(bg, 0, 0, cdiv.clientWidth, cdiv.clientHeight)
  }
  // ��������ש��
  drawBlocks (list) {
    for (let item of list) {
      this.drawImage(item)
    }
  }
  // ���Ƽ�����
  drawText (obj) {
    this.context.font = '24px Microsoft YaHei'
    this.context.fillStyle = '#000'
    // ���Ʒ���
    this.context.fillText(obj.text + obj.allScore, obj.x, obj.y)
    // ���ƹؿ�
    this.context.fillText(obj.textLv + obj.lv, this.canvas.width - 100, obj.y)
	storageScore = obj.allScore;
  }
  // ��Ϸ����
  gameOver () {
	globalScore = globalScore + storageScore;
    // �����ʱ��
    clearInterval(this.timer)
    // �������
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // ���Ʊ���ͼ
    //this.drawBg()
    // ������ʾ����
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('��û��ס��������򣡵÷֣�' + globalScore, 404, 226)
	$("#ballspeedset").removeAttr("disabled");
	// audio.pause();
	globalScore = 0;
  }
  // ��Ϸ����
  goodGame () {
	globalScore = globalScore + storageScore;
    // �����ʱ��
    clearInterval(this.timer)
    // �������
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // ���Ʊ���ͼ
    //this.drawBg()
    // ������ʾ����
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('CXK����һ�أ�', 308, 226)
	// audio.pause();
  }
  // ��Ϸͨ��
  finalGame () {
	globalScore = globalScore + storageScore;
    // �����ʱ��
    clearInterval(this.timer)
    // �������
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // ���Ʊ���ͼ
    //this.drawBg()
    // ������ʾ����
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('CXK��ͨ�أ��ܷ֣�' + globalScore, 308, 226)
	$("#ballspeedset").removeAttr("disabled");
	// audio.pause();
	globalScore = 0;
  }
  // ע���¼�
  registerAction (key, callback) {
    this.actions[key] = callback
  }
  // С����ײש����
  checkBallBlock (g, paddle, ball, blockList, score) {
    let p = paddle, b = ball
    // С����ײ������
    if (p.collide(b)) {
      // ��С���˶��������򵲰�����ʱ��Y���ٶ�ȡ������֮�򲻱�
      cxk_body = 4;
      if (Math.abs(b.y + b.h/2 - p.y + p.h/2) > Math.abs(b.y + b.h/2 + b.speedY - p.y + p.h/2)) {
        b.speedY *= -1
      } else {
        b.speedY *= 1
      }
      // ����X���ٶ�
      b.speedX = p.collideRange(b)
    }
    // С����ײש����
    blockList.forEach(function (item, i, arr) {
      if (item.collide(b)) { // С��ש������ײ
        if (!item.alive) { // ש��Ѫ��Ϊ0ʱ�������Ƴ�
          arr.splice(i, 1)
        }
        // ��С���˶���������ש������ʱ���ٶ�ȡ������֮�򲻱�
        if ((b.y < item.y && b.speedY < 0) || (b.y > item.y && b.speedY > 0)) {
          if (!item.collideBlockHorn(b)) {
            b.speedY *= -1
          } else { // ��С��ײ��ש���Ľ�ʱ��Y���ٶȲ���
            b.speedY *= 1
          }
        } else {
          b.speedY *= 1
        }
        // ��С��ײ��ש���Ľ�ʱ��X���ٶ�ȡ��
        if (item.collideBlockHorn(b)) {
          b.speedX *= -1
        }
        // �������
        score.computeScore()
      }
    })
    // �����ƶ�ʱ�߽���
    if (p.x <= 0) { // ����߽�ʱ
      p.isLeftMove = false
    } else {
      p.isLeftMove = true
    }
    if (p.x >= canvas.clientWidth - p.w) { // ���ұ߽�ʱ
      p.isRightMove = false
    } else {
      p.isRightMove = true
    }
    // �ƶ�С��
    b.move(g)
  }
  // ������֡����
  setTimer (paddle, ball, ballshadow, blockList, score) {
    let g = this
    let main = g.main
    g.timer = setInterval(function () {
      // actions����
      let actions = Object.keys(g.actions)
      for (let i = 0; i < actions.length; i++) {
        let key = actions[i]
        if(g.keydowns[key]) {
          // ������������£�����ע���action
          g.actions[key]()
        }
      }
      // ��ש������Ϊ0ʱ����ս�ɹ�
      if (blockList.length == 0) {
        if (main.LV === main.MAXLV) { // ���һ��ͨ��
          // ����ͨ��
          g.state = g.state_UPDATE
          // ��ս�ɹ�����Ⱦͨ�س���
          g.finalGame()
        } else { // ����ؿ�ͨ��
          // ����ͨ��
          g.state = g.state_UPDATE
          // ��ս�ɹ�����Ⱦ��һ�ؿ�����
          g.goodGame()
        }
      }
      // �ж���Ϸ�Ƿ����
      if (g.state === g.state_GAMEOVER) {
        g.gameOver()
      }
      // �ж���Ϸ��ʼʱִ���¼�
      if (g.state === g.state_RUNNING) {
        g.checkBallBlock(g, paddle, ball, blockList, score)
        // ������Ϸ�����ز�
        g.draw(paddle, ball, ballshadow, blockList, score)
      } else if (g.state === g.state_START){
        // ������Ϸ�����ز�
        g.draw(paddle, ball, ballshadow, blockList, score)
      }
    }, 1000/g.fps)
  }
  /**
   * ��ʼ������
   */
  init () {
    let g = this,
        paddle = g.main.paddle,
        ball = g.main.ball,
        ballshadow = g.main.ballshadow,
        blockList = g.main.blockList,
        score = g.main.score
    // ���ü��̰��¼��ɿ����ע�ắ��
    window.addEventListener('keydown', function (event) {
		if(event.keyCode == 65) {
			g.keydowns[37] = true;
		} else if(event.keyCode == 68) {
			g.keydowns[39] = true;
		} else if(event.keyCode == 88) {
			g.keydowns[37] = true;
		} else if(event.keyCode == 67) {
			g.keydowns[39] = true;
		} else {
			g.keydowns[event.keyCode] = true
		}
    })
    window.addEventListener('keyup', function (event) {
		if(event.keyCode == 65) {
			g.keydowns[37] = false;
		} else if(event.keyCode == 68) {
			g.keydowns[39] = false;
		} else if(event.keyCode == 88) {
			g.keydowns[37] = false;
		} else if(event.keyCode == 67) {
			g.keydowns[39] = false;
		} else {
			g.keydowns[event.keyCode] = false
		}
    })
	// ���������
    window.addEventListener('mousedown', function (event) {
		var clientWidth = document.body.clientWidth;
		if(event.clientX < clientWidth / 2) {
			g.keydowns[37] = true;
		} else {
			g.keydowns[39] = true;
		}
    })
    window.addEventListener('mouseup', function (event) {
		var clientWidth = document.body.clientWidth;
		if(event.clientX < clientWidth / 2) {
			g.keydowns[37] = false;
		} else {
			g.keydowns[39] = false;
		}
    })
	window.addEventListener('touchstart', function (event) {
		var clientWidth = document.body.clientWidth;
		if(event.touches[0].pageX < clientWidth / 2) {
			g.keydowns[37] = true;
		} else {
			g.keydowns[39] = true;
		}
		event.preventDefault();
	})
	window.addEventListener('touchend', function (event) {
		var clientWidth = document.body.clientWidth;
		if(event.changedTouches[0].pageX < clientWidth / 2) {
			g.keydowns[37] = false;
		} else {
			g.keydowns[39] = false;
		}
	})
    g.registerAction = function (key, callback) {
      g.actions[key] = callback
    }
    // ע��������ƶ��¼�
    g.registerAction('37', function(){
      // �ж���Ϸ�Ƿ������н׶�
      if (g.state === g.state_RUNNING && paddle.isLeftMove) {
		  move_way = 2;
        paddle.moveLeft()
      }
    })
    // ע���ҷ�����ƶ��¼�
    g.registerAction('39', function(){
      // �ж���Ϸ�Ƿ������н׶�
      if (g.state === g.state_RUNNING && paddle.isRightMove) {
		  move_way = 1;
        paddle.moveRight()
      }
    })
	window.startGame = function() {
		window.cacheBallSpeed = parseInt($("#ballspeedset").val());
		// audio.play();
		if(g.state !== g.state_UPDATE) {
			$("#ballspeedset").attr("disabled", "disabled");
			if (g.state === g.state_GAMEOVER) { // ��Ϸ����ʱ
				// ��ʼ��Ϸ
				g.state = g.state_START
				// ��ʼ��
				g.main.start()
			} else {
				// ��ʼ��Ϸ
				ball.fired = true
				g.state = g.state_RUNNING
			}
		}
	}
	window.nextGame = function() {
		// audio.play();
		if (g.state === g.state_UPDATE && g.main.LV !== g.main.MAXLV) { // ������һ��
            // ��ʼ��Ϸ
            g.state = g.state_START
            // ��ʼ����һ�ؿ�
            g.main.start(++g.main.LV)
			$("#ballspeedset").attr("disabled", "disabled");
        }
	}
	window.pauseGame = function() {
		// audio.pause();
		if(g.state !== g.state_UPDATE && g.state !== g.state_GAMEOVER) {
			g.state = g.state_STOP
		}
	}
    window.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        // ע��س��������¼�
        case 13 :
			window.cacheBallSpeed = parseInt($("#ballspeedset").val());
			// audio.play();
			if(g.state !== g.state_UPDATE) {
				$("#ballspeedset").attr("disabled", "disabled");
				if (g.state === g.state_GAMEOVER) { // ��Ϸ����ʱ
					// ��ʼ��Ϸ
					g.state = g.state_START
					// ��ʼ��
					g.main.start()
				} else {
					// ��ʼ��Ϸ
					ball.fired = true
					g.state = g.state_RUNNING
				}
			}
			break
		case 75 :
			window.cacheBallSpeed = parseInt($("#ballspeedset").val());
			// audio.play();
			if(g.state !== g.state_UPDATE) {
				$("#ballspeedset").attr("disabled", "disabled");
				if (g.state === g.state_GAMEOVER) { // ��Ϸ����ʱ
					// ��ʼ��Ϸ
					g.state = g.state_START
					// ��ʼ��
					g.main.start()
				} else {
					// ��ʼ��Ϸ
					ball.fired = true
					g.state = g.state_RUNNING
				}
			}
			break
        // N ��������һ�ؿ�
        case 78 :
          // ��Ϸ״̬Ϊͨ�أ��Ҳ�Ϊ���չؿ�ʱ
		  // audio.play();
          if (g.state === g.state_UPDATE && g.main.LV !== g.main.MAXLV) { // ������һ��
            // ��ʼ��Ϸ
            g.state = g.state_START
            // ��ʼ����һ�ؿ�
            g.main.start(++g.main.LV)
			$("#ballspeedset").attr("disabled", "disabled");
          }
          break
		/* case 77 :
		  if($("#audio").attr("src") == "media/jntm.m4a") {
			  audio.src = "about:blank";
			  audio.pause();
		  } else {
			  audio.src = "media/jntm.m4a";
			  audio.play();
		  }
		  break */
        // P ����ͣ��Ϸ�¼�
        case 80 :
		  if(g.state !== g.state_UPDATE && g.state !== g.state_GAMEOVER) {
			g.state = g.state_STOP
		  }
          break
      }
    })
    // ������ѯ��ʱ��
    g.setTimer(paddle, ball, ballshadow, blockList, score)
  }
}

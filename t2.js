
    let noncestr = 'Wm3WZYTPz0wzccnW',
      jsapi_ticket = this.session.jsapiTicket,
      timestamp = (this.session.jsapiTimestamp + '').slice(0, -3),
      url = 'http://www.xubo.ren/auth/',
      string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
      signature = sha1(string1)
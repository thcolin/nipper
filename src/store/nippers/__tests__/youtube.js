import p from 'path'
import fs from 'fs'
import * as youtube from 'store/nippers/youtube'
import CODECS from 'store/codecs'
import mock from 'xhr-mock'

const fixtures = {
  body: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'youtube.body.html'), 'utf8'),
  asset: fs.readFileSync(p.resolve(__dirname, 'fixtures', 'youtube.asset.javascript'), 'utf8'),
  ytplayer: {
    assets: {
      js: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js'
    },
    args: {
      url_encoded_fmt_stream_map: 'quality=medium&sp=signature&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fratebypass%3Dyes%26expire%3D1539641384%26dur%3D295.590%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26c%3DWEB%26itag%3D18%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D14671851%26key%3Dyt6%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Dvideo%252Fmp4%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Cratebypass%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537422418658272%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&s=CDCC7628D308A73EADD85B4CDCAC87E492271709.E43365929F462EA53F65C1C3F0C7F0BCFE983AB9B1B1&type=video%2Fmp4%3B+codecs%3D%22avc1.42001E%2C+mp4a.40.2%22&itag=18,quality=small&sp=signature&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.636%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D36%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D8111243%26key%3Dyt6%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Dvideo%252F3gpp%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537422417147614%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&s=876BB40749B98B2FC2BA562E1164DF0C1936B784.A97A50C91CC3139D8517CC455132FC3F71FEBE1C1414&type=video%2F3gpp%3B+codecs%3D%22mp4v.20.3%2C+mp4a.40.2%22&itag=36,quality=small&sp=signature&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.636%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D17%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D2967847%26key%3Dyt6%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Dvideo%252F3gpp%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537422418051519%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&s=16D34612D62DC373E5421D0CD0A4D8DB9C0E3E75.E1C7CE9D502633F4BCB3FEC5CEF1CDF6152621797676&type=video%2F3gpp%3B+codecs%3D%22mp4v.20.3%2C+mp4a.40.2%22&itag=17',
      adaptive_fmts: 'bitrate=1503005&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D137%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D23680280%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423451656518%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=B6AB394D7B136938FF3F417056178817F324DA02.21D1C5C0387187F004FD390D45074E802E4A431C1212&type=video%2Fmp4%3B+codecs%3D%22avc1.640028%22&quality_label=1080p&index=715-1454&xtags=&fps=24&sp=signature&clen=23680280&size=1920x1080&init=0-714&itag=137&lmt=1537423451656518,bitrate=1623195&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D248%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D19516542%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423774885001%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=9A2F87AAEAE74B0F9EAA8FE6F195A1350AD9AA29.DC262CCBEF3F6F75D39F5DE55E132454EA8CB73C3939&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=1080p&index=220-1218&xtags=&fps=24&sp=signature&clen=19516542&size=1920x1080&init=0-219&primaries=bt709&itag=248&lmt=1537423774885001,bitrate=827817&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D136%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D15313244%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423462159310%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=DB7A1B11C24125805F50EA5E013B5699264B15E1.D84C93305CE71E766DFA36FC8CD789872BF320A3A7A7&type=video%2Fmp4%3B+codecs%3D%22avc1.4d401f%22&quality_label=720p&index=713-1452&xtags=&fps=24&sp=signature&clen=15313244&size=1280x720&init=0-712&itag=136&lmt=1537423462159310,bitrate=965756&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D247%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D14596481%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423704708123%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=2B7C571117F9FE454072132CEA1AD5BD800BB957.93533ECCBB3454620628C17AE94CE3BCAF0001DCD6D6&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=720p&index=220-1212&xtags=&fps=24&sp=signature&clen=14596481&size=1280x720&init=0-219&primaries=bt709&itag=247&lmt=1537423704708123,bitrate=1121317&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D398%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26txp%3D5511222%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D21775246%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1538741479707673%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=75BEB1D7A367C733C74A25071CDD28EBC491864D.40D6D341292E2D9EA4AC598AF20D707BF5E273F4FCFC&type=video%2Fmp4%3B+codecs%3D%22av01.0.05M.08%22&quality_label=720p&index=705-1408&xtags=&fps=24&sp=signature&clen=21775246&size=1280x720&init=0-704&itag=398&lmt=1538741479707673,bitrate=535520&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D135%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D10724687%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423433831163%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=216218CE45B6F53B1A4B981EADDA7FB7998BE44E.818DB53857F514CCDD880D3297B984150F4D15F3FCFC&type=video%2Fmp4%3B+codecs%3D%22avc1.4d401e%22&quality_label=480p&index=713-1452&xtags=&fps=24&sp=signature&clen=10724687&size=854x480&init=0-712&itag=135&lmt=1537423433831163,bitrate=738848&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D244%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D13005620%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423700225879%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=76D2FB36CE1D6EA3FB132DA8915B2DE83194314B.9A51266150F9EE7A73F2A711369623A12122AFF6F0F0&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=480p&index=220-1212&xtags=&fps=24&sp=signature&clen=13005620&size=854x480&init=0-219&primaries=bt709&itag=244&lmt=1537423700225879,bitrate=559799&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D397%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26txp%3D5511222%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D10843899%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1538742902566593%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=6AF2047B1081F16BAB6EA56ADF9A103B869D3F7A.C009F80C079B32A5AAFCAA639A08D7E1F9AFA3202020&type=video%2Fmp4%3B+codecs%3D%22av01.0.05M.08%22&quality_label=480p&index=705-1408&xtags=&fps=24&sp=signature&clen=10843899&size=854x480&init=0-704&itag=397&lmt=1538742902566593,bitrate=359128&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D134%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D7522283%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423431661503%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=10FA9164056E55922118F3AEAF3B3DD3A013F864.9B62E139130650C14BB5E0BD1AE30C2EA970F5333A3A&type=video%2Fmp4%3B+codecs%3D%22avc1.4d401e%22&quality_label=360p&index=713-1452&xtags=&fps=24&sp=signature&clen=7522283&size=640x360&init=0-712&itag=134&lmt=1537423431661503,bitrate=407144&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D243%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D8984521%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423684710984%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=1622D08DF62B489FD719C0F2FBDDEF0C6B9FA178.9517058A5A7743233398B0BE0873B138D2C1FBF8FDFD&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=360p&index=220-1212&xtags=&fps=24&sp=signature&clen=8984521&size=640x360&init=0-219&primaries=bt709&itag=243&lmt=1537423684710984,bitrate=320086&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D396%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26txp%3D5511222%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D6470077%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1538740318046822%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=84469B470A38F0C33A3D682FF9D115AA2128C88D.4B983A4D2AFC582078C27A4CDD9764F7C47C31646969&type=video%2Fmp4%3B+codecs%3D%22av01.0.05M.08%22&quality_label=360p&index=705-1408&xtags=&fps=24&sp=signature&clen=6470077&size=640x360&init=0-704&itag=396&lmt=1538740318046822,bitrate=208726&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D133%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D3895357%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423431844326%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=8EE55C71E3C17400B0ACF0857105CEB390F3FB86.D94E07C60FF18AC6BE50F3C53CCA101E703CACBCBABA&type=video%2Fmp4%3B+codecs%3D%22avc1.4d4015%22&quality_label=240p&index=713-1452&xtags=&fps=24&sp=signature&clen=3895357&size=426x240&init=0-712&itag=133&lmt=1537423431844326,bitrate=223447&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D242%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D4067791%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423692021540%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=644AFF7C262627F6CEA13578C02EFD173DC3E274.30212BEAD07BF6C412D6686066DCFCB02F32E03E3D3D&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=240p&index=219-1210&xtags=&fps=24&sp=signature&clen=4067791&size=426x240&init=0-218&primaries=bt709&itag=242&lmt=1537423692021540,bitrate=179554&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D395%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26txp%3D5511222%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D3755029%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1538739921539591%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=E334981364EBA8AAE24939782D3362C2652C8156.205F64ADA457A62242C52E0793E8D70C6B2D198A8D8D&type=video%2Fmp4%3B+codecs%3D%22av01.0.05M.08%22&quality_label=240p&index=705-1408&xtags=&fps=24&sp=signature&clen=3755029&size=426x240&init=0-704&itag=395&lmt=1538739921539591,bitrate=76851&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D160%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D1426393%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423429221152%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=E06D74A4B8C60F7F586B45D249AEE45B6CB738A6.27BD384FBFE4D6B288771EA2853CBEF9161FCE444242&type=video%2Fmp4%3B+codecs%3D%22avc1.4d400c%22&quality_label=144p&index=712-1451&xtags=&fps=24&sp=signature&clen=1426393&size=256x144&init=0-711&itag=160&lmt=1537423429221152,bitrate=95775&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D278%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D3039391%26mime%3Dvideo%252Fwebm%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537423699729146%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=89F97474216CC1FADFA36B5335135542D7C9893B.AC71CA12DC0E88A6533ED08509A9DDB5B66300A1A7A7&type=video%2Fwebm%3B+codecs%3D%22vp9%22&eotf=bt709&quality_label=144p&index=219-1210&xtags=&fps=24&sp=signature&clen=3039391&size=256x144&init=0-218&primaries=bt709&itag=278&lmt=1537423699729146,bitrate=90580&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.503%26pl%3D22%26aitags%3D133%252C134%252C135%252C136%252C137%252C160%252C242%252C243%252C244%252C247%252C248%252C278%252C394%252C395%252C396%252C397%252C398%26pcm2%3Dyes%26ipbits%3D0%26gir%3Dyes%26itag%3D394%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26txp%3D5511222%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D2726877%26mime%3Dvideo%252Fmp4%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26key%3Dyt6%26mv%3Dm%26mt%3D1539619683%26sparams%3Daitags%252Cclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1538739681598410%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=A09941F81B93069917FEA0658B81C7BD6E056AC2.EC0C525E3CBB6BCEDC32BB7B29D7D492B81021959F9F&type=video%2Fmp4%3B+codecs%3D%22av01.0.05M.08%22&quality_label=144p&index=705-1408&xtags=&fps=24&sp=signature&clen=2726877&size=256x144&init=0-704&itag=394&lmt=1538739681598410,bitrate=127848&audio_sample_rate=44100&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.590%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D140%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D4695354%26key%3Dyt6%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Daudio%252Fmp4%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537422998647455%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=2FE24424CC204329B9AE8F0209E35F173C96274D.882736440F791FED3C6AA5BEC8ED21A4F8D591C4C2C2&type=audio%2Fmp4%3B+codecs%3D%22mp4a.40.2%22&index=592-983&xtags=&sp=signature&clen=4695354&init=0-591&itag=140&lmt=1537422998647455,bitrate=118085&audio_sample_rate=44100&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.530%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D171%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D4054975%26key%3Dyt6%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Daudio%252Fwebm%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537424647715633%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=D1379BA8858A2CAD72C4D0C1A28C977CC87C6821.D1CACF6BAC05D3DBF141C19C909E19A96D38FA868585&type=audio%2Fwebm%3B+codecs%3D%22vorbis%22&index=4446-4952&xtags=&sp=signature&clen=4054975&init=0-4445&itag=171&lmt=1537424647715633,bitrate=61314&audio_sample_rate=48000&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.541%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D249%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D1864039%26key%3Dyt6%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Daudio%252Fwebm%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537424647137942%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=CD76F16F413F02AA4C3F7D9512AB3664F1A32D80.E4380C426609B3041CF7EE47BC645166F0E418B4B7B7&type=audio%2Fwebm%3B+codecs%3D%22opus%22&index=266-771&xtags=&sp=signature&clen=1864039&init=0-265&itag=249&lmt=1537424647137942,bitrate=79276&audio_sample_rate=48000&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.541%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D250%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D2404805%26key%3Dyt6%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Daudio%252Fwebm%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537424650581546%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=A18C90DD2FA9738062492E0FBFFE040CE861855C.1A47B4DABB0C32E050D7700FA9937EB1B96D286D6C6C&type=audio%2Fwebm%3B+codecs%3D%22opus%22&index=266-772&xtags=&sp=signature&clen=2404805&init=0-265&itag=250&lmt=1537424650581546,bitrate=150806&audio_sample_rate=48000&url=https%3A%2F%2Fr4---sn-n4g-ouxl.googlevideo.com%2Fvideoplayback%3Fc%3DWEB%26expire%3D1539641384%26dur%3D295.541%26pl%3D22%26gir%3Dyes%26pcm2%3Dyes%26ipbits%3D0%26itag%3D251%26mn%3Dsn-n4g-ouxl%252Csn-n4g-jqbk%26mm%3D31%252C29%26requiressl%3Dyes%26clen%3D4596306%26key%3Dyt6%26keepalive%3Dyes%26source%3Dyoutube%26ms%3Dau%252Crdu%26mime%3Daudio%252Fwebm%26mv%3Dm%26mt%3D1539619683%26sparams%3Dclen%252Cdur%252Cei%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cmn%252Cms%252Cmv%252Cpcm2%252Cpl%252Crequiressl%252Csource%252Cexpire%26ip%3D77.201.202.121%26fvip%3D8%26lmt%3D1537424647428627%26id%3Do-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm%26ei%3DyLvEW9XGIYSsVbvDmqAO%26initcwndbps%3D1897500&projection_type=1&s=CCF0040DF2933BBCD0EBD29CE440EFCF15B8D5F8.F2BB7175973C5F5ADB8460C5B83B6F36DCC939E7E7E7&type=audio%2Fwebm%3B+codecs%3D%22opus%22&index=266-772&xtags=&sp=signature&clen=4596306&init=0-265&itag=251&lmt=1537424647428627'
    }
  },
  streams: [
    {
      itag: 18,
      format: youtube.FORMATS['18'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?ratebypass=yes&expire=1539641384&dur=295.590&pl=22&gir=yes&pcm2=yes&ipbits=0&c=WEB&itag=18&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=14671851&key=yt6&source=youtube&ms=au%2Crdu&mime=video%2Fmp4&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537422418658272&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: 'CDCC7628D308A73EADD85B4CDCAC87E492271709.E43365929F462EA53F65C1C3F0C7F0BCFE983AB9B1B1',
      signature: null
    },
    {
      itag: 17,
      format: youtube.FORMATS['17'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.636&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=17&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=2967847&key=yt6&source=youtube&ms=au%2Crdu&mime=video%2F3gpp&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537422418051519&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: '16D34612D62DC373E5421D0CD0A4D8DB9C0E3E75.E1C7CE9D502633F4BCB3FEC5CEF1CDF6152621797676',
      signature: null
    },
    {
      itag: 140,
      format: youtube.FORMATS['140'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.590&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=140&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=4695354&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fmp4&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537422998647455&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: '2FE24424CC204329B9AE8F0209E35F173C96274D.882736440F791FED3C6AA5BEC8ED21A4F8D591C4C2C2',
      signature: null
    },
    {
      itag: 171,
      format: youtube.FORMATS['171'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.530&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=171&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=4054975&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fwebm&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537424647715633&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: 'D1379BA8858A2CAD72C4D0C1A28C977CC87C6821.D1CACF6BAC05D3DBF141C19C909E19A96D38FA868585',
      signature: null
    },
    {
      itag: 249,
      format: youtube.FORMATS['249'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.541&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=249&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=1864039&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fwebm&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537424647137942&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: 'CD76F16F413F02AA4C3F7D9512AB3664F1A32D80.E4380C426609B3041CF7EE47BC645166F0E418B4B7B7',
      signature: null
    },
    {
      itag: 250,
      format: youtube.FORMATS['250'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.541&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=250&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=2404805&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fwebm&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537424650581546&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: 'A18C90DD2FA9738062492E0FBFFE040CE861855C.1A47B4DABB0C32E050D7700FA9937EB1B96D286D6C6C',
      signature: null
    },
    {
      itag: 251,
      format: youtube.FORMATS['251'],
      score: 0,
      url: 'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.541&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=251&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=4596306&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fwebm&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537424647428627&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500',
      asset: '/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      s: 'CCF0040DF2933BBCD0EBD29CE440EFCF15B8D5F8.F2BB7175973C5F5ADB8460C5B83B6F36DCC939E7E7E7',
      signature: null
    }
  ],
  expression: `var aL={NI:function(a,b){a.splice(0,b)},
jl:function(a){a.reverse()},
l5:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c}}; bL=function(a){a=a.split("");aL.jl(a,58);aL.NI(a,2);aL.l5(a,35);aL.NI(a,2);aL.jl(a,45);aL.l5(a,4);aL.jl(a,46);return a.join("")}; return bL("__SIGNATURE__");`,
  signature: '7E939CCD63F6B38B5C0648BDA5F5C3795717BB2F.8F5D8B51FCFE044EC92DBE0DCBB3392FD04C0FC0'
}

jest.mock('ffmpeg.js/ffmpeg-worker-youtube.js', () => {
  return function () {
    this.onmessage = () => {}
    this.onerror = () => {}
    this.terminate = () => this.queue.forEach(timeout => clearTimeout(timeout))
    this.postMessage = (event) => {
      this.queue = [
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: '  Duration: 00:02:37.21, start: 0.000000, bitrate: 114 kb/s'
          }
        }), 2000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=     831kB time=00:00:46.33 bitrate= 146.9kbits/s'
          }
        }), 3000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=    1725kB time=00:01:36.79 bitrate= 146.0kbits/s'
          }
        }), 4000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'stderr',
            data: 'size=    2837kB time=00:02:37.21 bitrate= 147.8kbits/s'
          }
        }), 5000),
        setTimeout(() => this.onmessage({
          data: {
            type: 'done',
            data: {
              MEMFS: [{
                data: 'Hello World !'
              }]
            }
          }
        }), 6000)
      ]
    }

    setTimeout(() => this.onmessage({
      data: {
        type: 'ready'
      }
    }), 1000)
  }
})

jest.setTimeout(300000)

describe('store/nippers/youtube', () => {
  beforeEach(() => mock.setup())
  afterEach(() => mock.teardown())

  it('should retrieve youtube page', (done) => {
    mock.get(
      'https://www.youtube.com/watch?v=uxpDa-c-4Mc&gl=US&hl=en&persist_hl=1&has_verified=1&bpctr=9999999999',
      {
        status: 200,
        body: fixtures.body
      }
    )

    youtube.retrieve('uxpDa-c-4Mc')
      .subscribe(
        (message) => expect(message.data.response).toEqual(fixtures.body),
        (err) => console.warn(err),
        () => done()
      )
  })

  it('should peel youtube page', () => {
    expect(youtube.peel(fixtures.body)).toMatchObject(fixtures.ytplayer)
  })

  it('should cast youtube `ytplayer` to streams', () => {
    expect(youtube.cast(fixtures.ytplayer).map(stream => stream.itag)).toEqual(fixtures.streams.map(stream => stream.itag))
  })

  it('should validate youtube streams', () => {
    expect(youtube.validate(fixtures.streams).length).toEqual(fixtures.streams.length)
  })

  it('should return best youtube stream', () => {
    expect(youtube.best(fixtures.streams, CODECS.mp3)).toMatchObject({
      itag: 251,
      format: youtube.FORMATS['251'],
      score: 160
    })
  })

  it('should simplify youtube js asset', () => {
    expect(youtube.simplify(fixtures.asset)).toEqual(fixtures.expression)
  })

  it('should solve youtube stream signature with asset', (done) => {
    mock.get(
      'https://www.youtube.com/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      {
        status: 200,
        body: fixtures.asset
      }
    )

    youtube.solve(fixtures.streams.filter(stream => stream.itag === 251).pop())
      .subscribe(
        stream => expect(stream.signature).toEqual(fixtures.signature),
        err => console.warn(err),
        () => done()
      )
  })

  it('should download/extract/convert/labelize youtube video', (done) => {
    const messages = []

    mock.get(
      'https://www.youtube.com/watch?v=uxpDa-c-4Mc&gl=US&hl=en&persist_hl=1&has_verified=1&bpctr=9999999999',
      {
        status: 200,
        body: fixtures.body
      }
    )

    mock.get(
      'https://www.youtube.com/yts/jsbin/player-vflO1Ey5k/fr_FR/base.js',
      {
        status: 200,
        body: fixtures.asset
      }
    )

    mock.get(
      'https://r4---sn-n4g-ouxl.googlevideo.com/videoplayback?c=WEB&expire=1539641384&dur=295.541&pl=22&gir=yes&pcm2=yes&ipbits=0&itag=251&mn=sn-n4g-ouxl%2Csn-n4g-jqbk&mm=31%2C29&requiressl=yes&clen=4596306&key=yt6&keepalive=yes&source=youtube&ms=au%2Crdu&mime=audio%2Fwebm&mv=m&mt=1539619683&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cexpire&ip=77.201.202.121&fvip=8&lmt=1537424647428627&id=o-ADYcCchI_nRVfW-tYC8le6tgCMyNRz7XWu-1TlOyisvm&ei=yLvEW9XGIYSsVbvDmqAO&initcwndbps=1897500&signature=7E939CCD63F6B38B5C0648BDA5F5C3795717BB2F.8F5D8B51FCFE044EC92DBE0DCBB3392FD04C0FC0',
      async (req, res) => {
        return res
          .headers({
            'Content-Length': '65536',
            'content-type': 'application/octet-stream'
          })
          .body(Array(65536).fill('0').join(''))
          .status(200)
      }
    )

    youtube.default('uxpDa-c-4Mc', CODECS.aac, { artist: 'Drake', song: 'Hotline Bling' })
      .subscribe(
        message => messages.push(message),
        err => console.warn(err),
        () => {
          expect(messages.filter(message => message.type === 'done').pop().data).toBeInstanceOf(File)
          expect(messages.filter(message => message.type === 'done').pop().data.type).toEqual('audio/aac')
          expect(messages.filter(message => message.type === 'done').pop().data.name).toEqual('Drake - Hotline Bling.m4a')
          expect(messages.filter(message => message.type === 'progress')).toEqual([
            { type: 'progress', data: 40 },
            { type: 'progress', data: 40 },
            { type: 'progress', data: 42.9 },
            { type: 'progress', data: 46.1 },
            { type: 'progress', data: 50 },
            { type: 'progress', data: 50 },
            { type: 'progress', data: 64.21 },
            { type: 'progress', data: 79.89 },
            { type: 'progress', data: 99 },
            { type: 'progress', data: 99 },
            { type: 'progress', data: 99.29 },
            { type: 'progress', data: 99.61 },
            { type: 'progress', data: 100 }
          ])

          done()
        }
      )
  })
})

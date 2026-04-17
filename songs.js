function generateSongs(type){
    let arr = [];
    for(let i=1;i<=10;i++){
        arr.push({
            name: `${type} Song ${i}`,
            src: "songs/song1.mp3"
        });
    }
    return arr;
}
const songsDB = {
    trending: [
        {name:"Aaya Sher", img:"images/aayasher.png", src:"songs/Aaya-Sher.mp3" ,movie:"The Paradise", singer:"Addula Jangi Reddy and Arjun Chandy"},
        {name:"Dekh Lenge Saala", img:"images/saala.png", src:"songs/Dekh-Lenge-Saala.mp3" ,movie:"Ustaad Bhagat Singh", singer:"Vishal Dadlani and Haripriya"},
        {name:"Nuvvunte Chaley", img:"images/nuvvuntechaley.png", src:"songs/Nuvvunte Chaley.mp3" ,movie:"Andhra King Taluka", singer:"Anirudh Ravichander"},
        {name:"Singari", img:"images/singari.png", src:"songs/Singari.mp3" ,movie:"Dude", singer:"Sai Abhyankkar"},
        {name:"Suvvi Suvvi", img:"images/suvvisuvvi.png", src:"songs/Suvvi-Suvvi.mp3" ,movie:"They Call Him OG", singer:"Sruthi Ranjani"},
        {name:"Chuttamalle", img:"images/chuttamalle.png", src:"songs/Chuttamalle.mp3" ,movie:"Devara: Part 1", singer:"Shilpa Rao"},
        {name:"Mallika Gandha", img:"images/mallikagandha.png", src:"songs/Mallika Gandha.mp3" ,movie:"Telusu Kada", singer:"Sid Sriram"},
        {name:"Vibe Undi", img:"images/vibeundi.png", src:"songs/Vibe Undi.mp3" ,movie:"Mirai", singer:"Armaan Malik"},
        {name:"Rai Rai Raa Raa", img:"images/rairairaaraa.png", src:"songs/Rai Rai Raa Raa.mp3" ,movie:"Peddi", singer:"A.R Rehman"},
        {name:"Monica", img:"images/monica.png", src:"songs/Monica.mp3" ,movie:"Coolie", singer:"Sublahshini and Anirudh Ravichander"}
    ],
    party: [
        {name:"Karthika Deepam Remix", img:"images/karthikadeepam.png", src:"songs/Karthika Deepam Remix.mp3" ,movie:"Bhartha Mahasayulaku Wignyapthi", singer:"Bheems Ceciroleo"},
        {name:"College Papa", img:"images/mad.png", src:"songs/College Papa.mp3" ,movie:"MAD", singer:"Bheems Ceciroleo"},
        {name:"Radhika", img:"images/radhika.png", src:"songs/Radhika.mp3" ,movie:"Tillu Square", singer:"Ram Miriyala"},
        {name:"Daang Daang", img:"images/daangdaang.png", src:"songs/Daang Daang.mp3" ,movie:"Sarileru Neekevvaru", singer:"Nakash Aziz and Lavita Lobo"},
        {name:"Pulsar Bike", img:"images/pulsarbike.png", src:"songs/Pulsar Bike.mp3" ,movie:"Dhamaka", singer:"Bheems Ceciroleo"},
        {name:"Humma Humma", img:"images/hummahumma.png", src:"songs/Humma Humma.mp3" ,movie:"Ooru Peru Bhairavakona", singer:"Ram Miriyala"},
        {name:"Mecchuko", img:"images/dj.png", src:"songs/Mecchuko.mp3" ,movie:"DJ (Duvvada Jagannadham)", singer:" Nakash Aziz"},
        {name:"Tillu Anna DJ Pedithe", img:"images/tilluanna.png", src:"songs/Tillu Anna DJ Pedithe.mp3" ,movie:" DJ Tillu", singer:"Ram Miriyala"},
        {name:"Gaajuvaka Pilla", img:"images/gaajuvakapilla.png", src:"songs/Gaajuvaka Pilla.mp3" ,movie:"Nuvvu Nenu", singer:"R.P. Patnaik"},
        {name:"Odiyamma", img:"images/odiyamma.png", src:"songs/Odiyamma.mp3" ,movie:"Hi Nanna", singer:"Dhruv Vikram and Shruti Haasan"}
    ],
    happy: [
        {name:"Oka Choopukae", img:"images/oka.png", src:"songs/Oka Choopukae.mp3" ,movie:"Naayak", singer:"Vijay Prakash and Bindu Mahima"},
        {name:"Seethakaalam", img:"images/seethakaalam.png", src:"songs/Seethakaalam.mp3" ,movie:"S/o Satyamurthy", singer:"Yazin Nizar"},
        {name:"Nuvvu Navvukuntu", img:"images/mad.png", src:"songs/Nuvvu Navvukuntu.mp3" ,movie:"MAD", singer:"Kapil Kapilan"},
        {name:"Nee Choopule", img:"images/nee.png", src:"songs/Nee Choopule.mp3" ,movie:" Endukante... Premanta", singer:" Haricharan and K.S. Chithra"},
        {name:"Maate Vinadhuga", img:"images/maatevinadhuga.png", src:"songs/Maate Vinadhuga.mp3" ,movie:"Taxiwaala", singer:"Sid Sriram"},
        {name:"Gaali Vaaluga", img:"images/gaalivealuga.png", src:"songs/Gaali Vaaluga.mp3" ,movie:"Agnyaathavaasi", singer:" Anirudh Ravichander"},
        {name:"Unnatundi Gundey", img:"images/unnatundigundey.png", src:"songs/Unnatundi Gundey.mp3" ,movie:" Ninnu Kori", singer:"Karthik and Chinmayi Sripaada"},
        {name:"Nenu Nuvvantu", img:"images/hellorammante.png", src:"songs/Nenu Nuvvantu.mp3" ,movie:"Orange", singer:"Naresh Iyer, Nadeesh, and U.V. Jackey"},
        {name:"Hoyna Hoyna", img:"images/hoyna.png", src:"songs/Hoyna Hoyna.mp3" ,movie:"Gang Leader", singer:" Inno Genga"},
        {name:"Uppenantha", img:"images/arya.png", src:"songs/Uppenantha.mp3" ,movie:"Arya 2", singer:"Krishnakumar Kunnath"}
    ],
    pearls: [
        {name:"Crazy Feeling", img:"images/crazy.png", src:"songs/Crazy-Feeling.mp3" ,movie:"Nenu Sailaja", singer:"Prudhvi Chandra"},
        {name:"Baitikochi Chusthe", img:"images/gaalivealuga.png", src:"songs/Baitikochi Chusthe.mp3" ,movie:"Agnyaathavaasi", singer:"Anirudh Ravichander"},
        {name:"Seethakalam", img:"images/seethakaalam.png", src:"songs/Seethakaalam.mp3" ,movie:"S/o Satyamurthy", singer:"Yazin Nizar"},
        {name:"Ninnila", img:"images/ninnila.png", src:"songs/Ninnila-.mp3" ,movie:"Tholi Prema", singer:" Armaan Malik"},
        {name:"Pareshanura", img:"images/dhruva.png", src:"songs/Pareshanura.mp3" ,movie:"Dhruva", singer:"Padmalatha and Vishnu Priya"},
        {name:"Choosi Chudangane", img:"images/chalo.png", src:"songs/Choosi Chudangane.mp3" ,movie:"Chalo", singer:"Anurag Kulkarni and Sagar"},
        {name:"Naanaa Hyraanaa", img:"images/naanaahyraanaa.png", src:"songs/Naanaa Hyraanaa.mp3" ,movie:"Game Changer", singer:"Karthik and Shreya Ghoshal"},
        {name:"Adiga Adiga", img:"images/unnatundigundey.png", src:"songs/Adiga Adiga.mp3" ,movie:"Ninnu Kori", singer:"Sid Sriram"},
        {name:"Gudilo Badilo Madilo", img:"images/dj.png", src:"songs/Gudilo Badilo Madilo.mp3" ,movie:"DJ - Duvvada Jagannadham", singer:"MLR Karthikeyan & K.S. Chithra"},
        {name:"Arerey Manasa", img:"images/arerey.png", src:"songs/Arerey Manasa.mp3" ,movie:"Falaknuma Das", singer:"Sid Sriram"}
    ], 
    hits: [
        {name:"Apple Beauty", img:"images/applebeauty.png", src:"songs/Apple Beauty.mp3" ,movie:"Janatha Garage", singer:"Yazin Nizar and Neha Bhasin"},
        {name:"Kallumoosi", img:"images/kallumoosi.png", src:"songs/Kallumoosi.mp3" ,movie:"Majnu", singer:"Suchith Suresan"},
        {name:"O Sayonara Sayonara", img:"images/sayonara.png", src:"songs/O Sayonara Sayonara.mp3" ,movie:"1 Nenokkadine", singer:"Sooraj Santhosh and M.M. Manasi"},
        {name:"Idhedho Bagundhe", img:"images/idhedhobagundhe.png", src:"songs/Idhedho Bagundhe.mp3" ,movie:"Mirchi", singer:"Vijay Prakash and Anitha Karthikeyan"},
        {name:"My Love Is Gone", img:"images/arya.png", src:"songs/My Love Is Gone.mp3" ,movie:"Arya 2", singer:"K.G. Ranjith"},
        {name:"Mari Antaga", img:"images/mariantaga.png", src:"songs/Mari Antaga.mp3" ,movie:" Seethamma Vakitlo Sirimalle Chettu", singer:" Sreerama Chandra"},
        {name:"Inkem Inkem", img:"images/inkeminkem.png", src:"songs/Inkem Inkem.mp3" ,movie:"Geetha Govindam", singer:"Sid Sriram"},
        {name:"Kopamga Kopamga", img:"images/kopamga.png", src:"songs/Kopamga Kopamga.mp3" ,movie:"Mr. Majnu", singer:"Armaan Malik"},
        {name:"Ninnila", img:"images/ninnila.png", src:"songs/Ninnila.mp3" ,movie:"Tholi Prema", singer:"Armaan Malik"},
        {name:"Prema Vennela", img:"images/premavennela.png", src:"songs/Prema Vennela.mp3" ,movie:"Chitralahari", singer:"Sudharshan Ashok"}
    ],
    y2020: [
        {name:"Chukkala Chunni", img:"images/chukkalachunni.png", src:"songs/Chukkala Chunni.mp3" ,movie:"SR Kalyanamandapam", singer:"Anurag Kulkarni"},
        {name:"Srivalli", img:"images/srivalli.png", src:"songs/Srivalli.mp3" ,movie:"Pushpa: The Rise", singer:"Sid Sriram"},
        {name:"Ramuloo Ramula", img:"images/ramulooramula.png", src:"songs/Ramuloo Ramula.mp3" ,movie:"Ala Vaikunthapurramuloo", singer:"Anurag Kulkarni and Mangli"},
        {name:"Hey Idi Nenena", img:"images/heyidinenena.png", src:"songs/Hey Idi Nenena.mp3" ,movie:"Solo Brathuke So Better", singer:"Sid Sriram"},
        {name:"Suvvi Suvvi", img:"images/suvvisuvvi.png", src:"songs/Suvvi-Suvvi.mp3" ,movie:"They Call Him OG", singer:"Sruthi Ranjani"},
        {name:"Neeli Neeli Aakasam", img:"images/neelinelakasam.png", src:"songs/Neeli Neeli Aakasam.mp3" ,movie:"30 Rojullo Preminchadam Ela", singer:"Sid Sriram and Sunitha"},
        {name:"Daavudi", img:"images/daavudi.png", src:"songs/Daavudi.mp3" ,movie:"Devara: Part 1", singer:"Nakash Aziz and Akasa"},
        {name:"Avunanavaa", img:"images/avunanavaa.png", src:"songs/Avunanavaa.mp3" ,movie:"Ori Devuda", singer:"Sid Sriram"},
        {name:"Samayama", img:"images/samayama.png", src:"songs/Samayama.mp3" ,movie:"Hi Nanna", singer:"Anurag Kulkarni and Sithara Krishnakumar"},
        {name:"Naanaa Hyraanaa", img:"images/naanaahyraanaa.png", src:"songs/Naanaa Hyraanaa.mp3" ,movie:"Game Changer", singer:"Shreya Ghoshal and Karthik"}
    ],
    y2010: [
        {name:"Chiru Chiru", img:"images/chiruchiru.png", src:"songs/Chiru Chiru.mp3" ,movie:"Awaara", singer:"Haricharan and Tanvi Shah"},
        {name:"Gaali Vaaluga", img:"images/gaalivealuga.png", src:"songs/Gaali Vaaluga.mp3" ,movie:"Agnyaathavaasi", singer:"Anirudh Ravichander"},
        {name:"Guruvaram", img:"images/guruvaram.png", src:"songs/Guruvaram.mp3" ,movie:"Kirrak Party", singer:"Vijay Prakash"},
        {name:"Hello Rammante", img:"images/hellorammante.png", src:"songs/Hello-Rammante.mp3" ,movie:"Orange", singer:"Vijay Prakash, Devan Ekambaram, and D. Burns"},
        {name:"Mella Mellaga", img:"images/mellamellaga.png", src:"songs/Mella Mellaga.mp3" ,movie:"ABCD - American Born Confused Desi", singer:"Sid Sriram and Aditi Bhavaraju"},
        {name:"Motta Modatisari", img:"images/mottamodatisari.png", src:"songs/Motta Modatisari.mp3" ,movie:"Bhale Bhale Magadivoi", singer:"Sachin Warrier"},
        {name:"Naatu Naatu", img:"images/naatunaatu.png", src:"songs/Naatu-Naatu.mp3" ,movie:"RRR (Roudram Ranam Rudhiram)", singer:"Rahul Sipligunj and Kaala Bhairava"},
        {name:"Saranga Dariya", img:"images/sarangadariya.png", src:"songs/Saranga Dariya.mp3" ,movie:"Love Story", singer:"Mangli"},
        {name:"Pilla Raa", img:"images/pillaraa.png", src:"songs/Pilla Raa.mp3" ,movie:"RX 100", singer:"Anurag Kulkarni"},
        {name:"Rangamma Mangamma", img:"images/rangammamangamma.png", src:"songs/Rangamma Mangamma.mp3" ,movie:"Rangasthalam", singer:"MM Manasi,"}
    ],
    y2000: [
        {name:"Nammavemo", img:"images/nammavemo.png", src:"songs/Nammavemo.mp3" ,movie:"Parugu", singer:"Saketh"},
        {name:"Made In Andhra Student", img:"images/thammudu.png", src:"songs/Made In Andhra Student.mp3" ,movie:"Thammudu", singer:"Ramana Gogula"},
        {name:"Apudo Ipudo", img:"images/bommarillu.png", src:"songs/Apudo Ipudo.mp3" ,movie:"Bommarillu", singer:"Siddharth"},
        {name:"Jennifer Lopez", img:"images/jalsa.png", src:"songs/Jennifer Lopez.mp3" ,movie:"Jalsa", singer:"Benny Dayal and Priya"},
        {name:"Muvvala Navvakala", img:"images/pournami.png", src:"songs/Muvvala Navvakala.mp3" ,movie:"Pournami", singer:"S.P. Balasubrahmanyam and K.S. Chithra"},
        {name:"Niluvadhamu Ninu Epudaina", img:"images/nilu.png", src:"songs/Niluvadhamu Ninu Epudaina.mp3" ,movie:"", singer:""},
        {name:"Gaallo Thelinattunde", img:"images/jalsa.png", src:"songs/Gaallo Thelinattunde.mp3" ,movie:"Nuvvostanante Nenoddantana", singer:"Karthik and Sumangali"},
        {name:"Uppenantha", img:"images/arya.png", src:"songs/Uppenantha.mp3" ,movie:"Arya 2", singer:"KK(Krishnakumar Kunnath)"},
        {name:"Bommanu Geesthey", img:"images/bommarillu.png", src:"songs/Bommanu Geesthey.mp3" ,movie:"Bommarillu", singer:"Jeans Srinivas and Gopika Poornima"},
        {name:"Oy! Oy!", img:"images/oyoy.png", src:"songs/Oy! Oy!.mp3" ,movie:"Oy!", singer:"Siddharth and Prashanthini"}
    ],
    y1990: [
        {name:"Balapam Patti", img:"images/balapam.png", src:"songs/Balapam Patti.mp3" ,movie:"Bobbili Raja", singer:"S.P. Balasubrahmanyam and K.S. Chithra"},
        {name:"Abbanee", img:"images/abbanee.png", src:"songs/Abbanee.mp3" ,movie:"Jagadeka Veerudu Athiloka Sundari", singer:"S.P. Balasubrahmanyam and K.S. Chithra"},
        {name:"Hello Guru", img:"images/helloguru.png", src:"songs/Hello Guru.mp3" ,movie:"Nirnayam", singer:"S.P. Balasubrahmanyam"},
        {name:"Jaamu Rathiri", img:"images/jaamurathiri.png", src:"songs/Jaamu Rathiri.mp3" ,movie:"Kshana Kshanam", singer:"S. P. Balasubrahmanyam and K. S. Chithra"},
        {name:"Yemi Cheyamanduve", img:"images/yemi.png", src:"songs/Yemi Cheyamanduve.mp3" ,movie:"Priyuralu Pilichindi", singer:"Shankar Mahadevan"},
        {name:"Vaalu Kanuladaanaa", img:"images/vaalu.png", src:"songs/Vaalu Kanuladaanaa.mp3" ,movie:"Premikula Roju", singer:"Unni Menon"},
        {name:"Kanya Kumari", img:"images/balapam.png", src:"songs/Kanya Kumari.mp3" ,movie:"Bobbili Raja", singer:"S. P. Balasubrahmanyam and S. Janaki"}
    ]
};
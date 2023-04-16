
d3.tsv('data/adventure_time_all_eps_with_scene_num.tsv')
    .then(_data => {
        let data = _data;
        console.log(data);
        data.forEach(d => {
            d.season = +d.season;
            d.ep_num  = +d.ep_num;
            d.scene_num = +d.scene_num;
        });
        
        let wordCloud = new WordCloud(data);
    })
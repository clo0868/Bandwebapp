
const comp = {"compID":2,"comp_name":"HPSC Sunday Morning Solos","comp_location":"St Andrews College","comp_start_time":"2022-06-25T21:00:00.000Z","ent_open_time":"2022-06-17T21:00:00.000Z","ent_close_time":"2023-06-24T21:00:00.000Z","comp_rooms":"[{\"room_name\":\"1\",\"room_judge\":\"1\",\"room_steward\":\"1\"},{\"room_name\":\"2\",\"room_judge\":\"2\",\"room_steward\":\"2\"},{\"room_name\":\"3\",\"room_judge\":\"3\",\"room_steward\":\"3\"},{\"room_name\":\"4\",\"room_judge\":\"4\",\"room_steward\":\"4\"}]","comp_events":"[{\"event\":1,\"grade\":1},{\"event\":2,\"grade\":1},{\"event\":4,\"grade\":1},{\"event\":1,\"grade\":2},{\"event\":2,\"grade\":2},{\"event\":4,\"grade\":2},{\"event\":1,\"grade\":3},{\"event\":2,\"grade\":3},{\"event\":4,\"grade\":3},{\"event\":1,\"grade\":4},{\"event\":2,\"grade\":4},{\"event\":4,\"grade\":4},{\"event\":5,\"grade\":5},{\"event\":3,\"grade\":6}]","comp_schedule":"0"}

const entries = [
    {"entryID":1,"userID":4,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":2,"userID":4,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":3,"userID":4,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":4,"userID":5,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":5,"userID":5,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":6,"userID":5,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":7,"userID":6,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":8,"userID":6,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":9,"userID":6,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":10,"userID":7,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":11,"userID":7,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":12,"userID":7,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":13,"userID":8,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":14,"userID":8,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":15,"userID":8,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":16,"userID":9,"compID":2,"gradeID":3,"eventID":1,"placing":0},
    {"entryID":17,"userID":9,"compID":2,"gradeID":3,"eventID":2,"placing":0},
    {"entryID":18,"userID":9,"compID":2,"gradeID":3,"eventID":4,"placing":0},
    {"entryID":19,"userID":10,"compID":2,"gradeID":2,"eventID":1,"placing":0},
    {"entryID":20,"userID":10,"compID":2,"gradeID":2,"eventID":2,"placing":0},
    {"entryID":21,"userID":10,"compID":2,"gradeID":2,"eventID":4,"placing":0},
    {"entryID":22,"userID":11,"compID":2,"gradeID":2,"eventID":1,"placing":0},
    {"entryID":23,"userID":11,"compID":2,"gradeID":2,"eventID":2,"placing":0},
    {"entryID":24,"userID":11,"compID":2,"gradeID":2,"eventID":4,"placing":0},
    {"entryID":25,"userID":12,"compID":2,"gradeID":2,"eventID":1,"placing":0},
    {"entryID":26,"userID":12,"compID":2,"gradeID":2,"eventID":2,"placing":0},
    {"entryID":27,"userID":12,"compID":2,"gradeID":2,"eventID":4,"placing":0},
    {"entryID":28,"userID":13,"compID":2,"gradeID":2,"eventID":1,"placing":0},
    {"entryID":29,"userID":13,"compID":2,"gradeID":2,"eventID":2,"placing":0},
    {"entryID":30,"userID":13,"compID":2,"gradeID":2,"eventID":4,"placing":0},
    {"entryID":31,"userID":15,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":32,"userID":15,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":33,"userID":15,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":34,"userID":16,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":35,"userID":16,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":36,"userID":16,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":37,"userID":17,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":38,"userID":17,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":39,"userID":17,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":40,"userID":18,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":41,"userID":18,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":42,"userID":18,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":43,"userID":19,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":44,"userID":19,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":45,"userID":19,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":46,"userID":20,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":47,"userID":20,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":48,"userID":20,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":49,"userID":21,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":50,"userID":21,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":51,"userID":21,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":52,"userID":22,"compID":2,"gradeID":1,"eventID":1,"placing":0},
    {"entryID":53,"userID":22,"compID":2,"gradeID":1,"eventID":2,"placing":0},
    {"entryID":54,"userID":22,"compID":2,"gradeID":1,"eventID":4,"placing":0},
    {"entryID":67,"userID":14,"compID":2,"gradeID":4,"eventID":1,"placing":0},
    {"entryID":68,"userID":14,"compID":2,"gradeID":4,"eventID":2,"placing":0},
    {"entryID":69,"userID":14,"compID":2,"gradeID":4,"eventID":4,"placing":0},
    {"entryID":70,"userID":14,"compID":2,"gradeID":5,"eventID":5,"placing":0},
    {"entryID":71,"userID":14,"compID":2,"gradeID":6,"eventID":3,"placing":0},
    {"entryID":72,"userID":25,"compID":2,"gradeID":4,"eventID":1,"placing":0},
    {"entryID":73,"userID":25,"compID":2,"gradeID":4,"eventID":2,"placing":0},
    {"entryID":74,"userID":25,"compID":2,"gradeID":4,"eventID":4,"placing":0},
    {"entryID":75,"userID":25,"compID":2,"gradeID":5,"eventID":5,"placing":0},
    {"entryID":76,"userID":25,"compID":2,"gradeID":6,"eventID":3,"placing":0},
    {"entryID":77,"userID":30,"compID":2,"gradeID":4,"eventID":1,"placing":0},
    {"entryID":78,"userID":30,"compID":2,"gradeID":4,"eventID":2,"placing":0},
    {"entryID":79,"userID":30,"compID":2,"gradeID":4,"eventID":4,"placing":0},
    {"entryID":80,"userID":30,"compID":2,"gradeID":5,"eventID":5,"placing":0},
    {"entryID":81,"userID":30,"compID":2,"gradeID":6,"eventID":3,"placing":0},
    {"entryID":82,"userID":31,"compID":2,"gradeID":4,"eventID":1,"placing":0},
    {"entryID":83,"userID":31,"compID":2,"gradeID":4,"eventID":2,"placing":0},
    {"entryID":84,"userID":31,"compID":2,"gradeID":4,"eventID":4,"placing":0},
    {"entryID":85,"userID":31,"compID":2,"gradeID":5,"eventID":5,"placing":0},
    {"entryID":86,"userID":31,"compID":2,"gradeID":6,"eventID":3,"placing":0},
    {"entryID":87,"userID":32,"compID":2,"gradeID":4,"eventID":1,"placing":0},
    {"entryID":88,"userID":32,"compID":2,"gradeID":4,"eventID":2,"placing":0},
    {"entryID":89,"userID":32,"compID":2,"gradeID":4,"eventID":4,"placing":0},
    {"entryID":90,"userID":32,"compID":2,"gradeID":5,"eventID":5,"placing":0},
    {"entryID":91,"userID":32,"compID":2,"gradeID":6,"eventID":3,"placing":0},
    ]

async function create_schedule(){
    const comp_rooms = JSON.parse(comp.comp_rooms)
    const comp_events = JSON.parse(comp.comp_events)

    function find_critical_order(events){
        var sch_rooms = Array.apply(null, Array(comp_rooms.length)).map(i => i=[])
        const user_list = [...new Set(entries.map((v) => (v.userID)))].map((v)=> ({userID:v,start_times:[]}));
        //const avg_time = (events.reduce((t, v) => {return t + v.time},0))/events.length
        //const events_per_room = parseInt(events.length.toString(sch_rooms.length))
        //console.log(avg_time,events_per_room);
        events.sort(function(a, b){return a.time - b.time});
        //events.map((v) => {console.log(v.event,v.event_entries,v.time);})
        events.map((event,i_events) => {
            console.log(event.event);
            const start_time = sch_rooms[i_events.toString(4).slice(-1)].reduce((t, v) => {return t + v.time},0)
            sch_rooms[i_events.toString(4).slice(-1)].push(event)
            sch_rooms[i_events.toString(4).slice(-1)][sch_rooms[i_events.toString(4).slice(-1)].length-1].event_entries.map((v_entry,i_entry) =>{
                user_list.forEach((v_user,i_user) => {v_user.userID === v_entry.userID && v_user.start_times.push(start_time)})
                
            })
            console.log(user_list);
            
        })
        
        //sch_rooms.map((v,i) => {console.log(comp_rooms[i].room_name); v.map((x) => {console.log(x ,x.event.grade)})})

    }

    
    
    const all_events = comp_events.map((event) => {        
        var event_entries = entries.filter((v) => {return v.gradeID === event.grade && v.eventID === event.event });
        const event_time = (event_entries.length*5)+5
        return{event,event_entries,time:event_time}
    })
    
    find_critical_order(all_events)
}



create_schedule();


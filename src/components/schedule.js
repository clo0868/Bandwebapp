console.log('launch');
var over_start_time = process.hrtime();

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

    function find_critical_order(events,n){
        events.sort(function(a, b){return b.time - a.time});
        
        var sch_rooms = Array.apply(null, Array(n)).map(i => i=[])
        //console.log(sch_rooms);
        events.map((event,i_events) => {
            //sch_rooms.forEach((value,index) => {value.length === 0 ? console.log("0") : console.log(value.reduce((t,v) => {return t+v.time},0));})
            sch_rooms.sort(function(a, b){return a.reduce((t,v) => {return t+v.time},0) - b.reduce((t,v) => {return t+v.time},0)});
            sch_rooms[0].push(event)
            //console.log(sch_rooms)
        })

        sch_rooms.sort(function(a, b){return b.reduce((t,v) => {return t+v.time},0) - a.reduce((t,v) => {return t+v.time},0)});
        //console.log("minimum time:"+sch_rooms[0].reduce((t,v) => {return t+v.time},0)+" minutes");
        
        return sch_rooms
        
    }

    function sort_users(entries,rooms){
        const user_list = [...new Set(entries.map((v) => (v.userID)))].map((v)=> ({userID:v,play_times:[]}));
        //console.log(user_list);
        
        
        function permutator(inputArr) {
            var results = [];
            
            //console.log(inputArr);
            function permute(arr, memo) {
              var cur, memo = memo || [];
          
              for (var i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1);
                if (arr.length === 0) {
                  results.push(memo.concat(cur));
                  //console.log(cur);
                }
                permute(arr.slice(), memo.concat(cur));
                arr.splice(i, 0, cur[0]);
              }
          
              return results;
            }
            return permute(inputArr);
          }
    
        function isPossiblePlayTime(user,play_time){
            //check if user can play at the given time 
    
            if (user.play_times.length === 0) {
                //if user has no current playing times then they can play 
                return true 
            }
    
    
            return user.play_times.map((user_play_time) =>{ 
                //check if given play time is within 5 minutes of another playing time of theirs
                return (play_time <= (user_play_time - 10)|| play_time >= (user_play_time + 10))
    
                //if any values return false user cannot play at that time 
            }).every((value) => (value === true))
    
        }
    
    
        function orderEvent(entries,start_time,user_list){
    
            //const entries_userID = entries.map((v) => {return {userID:v.userID}})
            //gives array of all permutations of entrants 
            const all_perm_entries = permutator(entries).reverse()
            
            const cannot_play = []
            //loop through all permutations 
            try{
                for (const [perm_index,entries] of all_perm_entries.entries()) {
    
                    //console.log(cannot_play);
                    //check to see if any perm values have already been checked and returned false
                    const already_been_checked = cannot_play.filter((v) => {return entries[v.perm_index].userID === v.userID})
                    if (already_been_checked.length>0) continue;
                
                    //set inital return value 
                    const return_event = []
    
                    //create temporary userlist 
                    //console.log(entries.map((v) => {return v.userID})); 
    
                    //loop through each entry in the permutation 
                    for (const [entry_index,entry] of entries.entries()) {                    
                        //console.log(entry);
                        //map through user list to find the corresponding user 
                        user_list.forEach((user,useri) => {
                            if (user.userID === entry.userID) {
                                //console.log(user.userID+'user');
                                //once user found check if they can play at the given time 
                                const can_play = isPossiblePlayTime(user,start_time+(5*entry_index))
                                //console.log(can_play);
                                if (can_play) {
                                    return_event.push({entry,play_time:start_time+(5*entry_index)})
                                    if (return_event.length === entries.length ) {   
                                        
                                        //if all entries have returned true break loop
                                        throw(return_event);
                                    }
                                }else{
                                    cannot_play.push({userID:user.userID,perm_index:entry_index})
                                }
    
                            }
                        })
                    }
                }
            }catch(err){
                console.log(err.length);
                err.forEach((entry) => {
                    //console.log(entry.play_time);
                    //const userIndex = user_list.findIndex(user => user.userID === entry.userID);

                    user_list.forEach((user,useri) => {
                        if (user.userID === entry.entry.userID) {
                            user.play_times.push(entry.play_time)
                        }
                    })
                })
                //console.log(user_list);
                //console.log(err.map((v)=>{console.log(v);}))
                return err
            }
            
        }
    
        function orderRoom(room,user_list){
            return_room = []
            room.map((v)=>{console.log(v.event);})
            for (const [event_index,event] of room.entries()) {
                //console.log(event);
                const start_time = room.slice(0,event_index).reduce((t,v) => {return t+v.time},0)
                const ordered_event = orderEvent(event.event_entries,start_time,user_list)
                if (ordered_event) {                    
                    return_room.push(ordered_event)
                    console.log(return_room.length+'return');
                    if (return_room.length === room.length) {return return_room}                   
                }else{
                    room.push(room.shift());
                    return orderRoom(room,user_list)
                }
            }
        }
    
        rooms.map((room,room_index) => {
            console.log(room_index);
            const ordered_room = orderRoom(room,user_list)
            console.log(ordered_room);
        })
    //const result = orderEvent(entries,0,user_list)
    //console.log(result);
    
    


    }

    
    
    const all_events = comp_events.map((event) => {   

        var event_entries = entries.filter((v) => {return v.gradeID === event.grade && v.eventID === event.event });

        const event_time = (event_entries.length*5)+5

        return({event,event_entries,time:event_time})
    })
    
    const critical_order = find_critical_order(all_events,comp_rooms.length)
    console.log(critical_order);
    //const user_sorted_rooms = sort_users(entries,critical_order)
    sort_users(entries,critical_order)
}



create_schedule();
var over_end_time = process.hrtime(over_start_time);

console.log(over_end_time);

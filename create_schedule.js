

function create_schedule(comp,entries){
    console.log('launch');
    var over_start_time = process.hrtime();
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
                return (play_time <= (user_play_time - 15)|| play_time >= (user_play_time + 15))
    
                //if any values return false user cannot play at that time 
            }).every((value) => (value === true))
    
        }
    
    
        function orderEvent(entries,start_time,user_list){
            //console.log(user_list);
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
                                        throw({return_event,time:((entries.length*5)+5)});
                                    }
                                }else{
                                    cannot_play.push({userID:user.userID,perm_index:entry_index})
                                }
    
                            }
                        })
                    }
                }
                //console.log(cannot_play);
            }catch(err){
                //console.log(err.length);
                
                //console.log(user_list);
                //console.log(err.map((v)=>{console.log(v);}))
                return err
            }
            
        }
    
        function orderRoom(room,user_list,max_time){
            all_perm_room = permutator(room).reverse()
            var return_room = []
            
            //room.map((v)=>{console.log(v.event);})
            const finish_time = room.reduce((t,v) => {return t+v.time},0)
            const float_time = max_time-finish_time
            var delay = 0
            try{
                while(true){                    
                    if (delay>float_time) {
                        //console.log('big delay');
                    }
                    for (const [perm_index,perm] of all_perm_room.entries()) {
                        //console.log(delay);
                        //perm.map((v)=>{console.log(v.event);})
                        
                        return_room = []
                        for (const [event_index,event] of perm.entries()) {
                            //console.log(event);
                            const start_time = (perm.slice(0,event_index).reduce((t,v) => {return t+v.time},0))+delay
                            //console.log(start_time);
                            const ordered_event = orderEvent(event.event_entries,start_time,user_list)
                            //console.log(ordered_event ? ordered_event.length+'   event':undefined);
                            if (ordered_event) {                    
                                return_room.push(ordered_event)
                                //console.log(return_room.length+'return');
                                if (return_room.length === room.length) {throw {return_room,delay,finish_time:start_time+10}}                   
                            }
                            
                        }                
                    }
                 delay+=5
                }
                
                  
            }catch(err){
                for (const [eventi,event] of err.return_room.entries()) {
                    event.return_event.forEach((entry) => {    
                        user_list.forEach((user,useri) => {
                            if (user.userID === entry.entry.userID) {
                                user.play_times.push(entry.play_time)
                            }
                        })
                    })
                }
                console.log(err);
                return err
                
            }         
        }
    
        const result = rooms.map((room,room_index) => {
            //console.log(room_index);
            const max_time = rooms[0].reduce((t,v) => {return t+v.time},0)
            const ordered_room = orderRoom(room,user_list,max_time)
            //console.log(user_list);
            return ordered_room
            
        })
    
        return(result)


    }

    const all_events = comp_events.filter((event) => {   

        var event_entries = entries.filter((v) => {return v.gradeID === event.grade && v.eventID === event.event });

        return event_entries.length > 0    
        
        
    }).map((event) => {
        var event_entries = entries.filter((v) => {return v.gradeID === event.grade && v.eventID === event.event });

        const event_time = (event_entries.length*5)+5
        return({event,event_entries,time:event_time})
    })
    const critical_order = find_critical_order(all_events,comp_rooms.length)
    const schedule = sort_users(entries,critical_order)
    var over_end_time = process.hrtime(over_start_time);
    return schedule
}

module.exports = create_schedule;

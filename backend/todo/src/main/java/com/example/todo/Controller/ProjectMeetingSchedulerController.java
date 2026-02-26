// package com.example.todo.Controller;

// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.security.core.Authentication;

// import com.example.todo.UserAuthentication;
// import com.example.todo.Repository.UserRepository;
// import com.example.todo.dto.MeetingScheduleRequestDto;

// @RestController
// @RequestMapping("/meeting")
// public class ProjectMeetingSchedulerController {

//     @Autowired
//     private UserRepository userRepo;

//     @PostMapping("/connect-google")
//     public void generateOAuthUrl(){

//     }

//     @PostMapping("/schedule/{projectId}")
//     public ResponseEntity<?> scheduleMeeting(Authentication authenticate, 
//                                             @RequestParam Long projectId, 
//                                             @RequestBody MeetingScheduleRequestDto requestDto){
//         String adminId = authenticate.getName();
//         Optional<UserAuthentication> userOpt=userRepo.findById(adminId);
//         if(userOpt.isEmpty()){
//             return ResponseEntity.status(403).body("user not found");
//         }

//         UserAuthentication user=userOpt.get();
//         if(!"ADMIN".equals(user.getRole())){
//             return ResponseEntity.status(403).body("Only admin can create meetings");
//         }





        





//     }
    
// }

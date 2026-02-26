// package com.example.todo.Controller;

// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;

// import com.example.todo.AdminGoogleAuthEntity;
// import com.example.todo.ProjectEntity;
// import com.example.todo.ProjectMeetingEntity;
// import com.example.todo.UserAuthentication;
// import com.example.todo.Repository.*;
// import com.example.todo.Service.GoogleMeetService;
// import com.example.todo.dto.MeetingScheduleRequestDto;

// @RestController
// @RequestMapping("/meeting")
// public class ProjectMeetingSchedulerController {

//     @Autowired
//     private UserRepository userRepo;

//     @Autowired
//     private AdminGoogleAuthRepository adminGoogleAuthRepo;

//     @Autowired
//     private ProjectRepository projectRepo;

//     @Autowired
//     private ProjectMeetingRepository meetingRepo;

//     @Autowired
//     private GoogleMeetService googleMeetService;

//     // Connect Google
//     @PostMapping("/connect-google")
//     public ResponseEntity<?> generateOAuthUrl(Authentication authentication) {

//         String adminId = authentication.getName();

//         UserAuthentication user = userRepo.findById(adminId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         if (!"ADMIN".equals(user.getRole())) {
//             return ResponseEntity.status(403)
//                     .body("Only admin can connect Google");
//         }

//         Optional<AdminGoogleAuthEntity> authOpt =
//                 adminGoogleAuthRepo.findById(adminId);

//         if (authOpt.isPresent() && authOpt.get().isConnected()) {
//             return ResponseEntity.ok("Already Connected");
//         }

//         String url = googleMeetService.generateOAuthUrl(adminId);
//         return ResponseEntity.ok(url);
//     }

//     //OAuth Callback
//     @GetMapping("/oauth/callback")
//     public ResponseEntity<?> handleCallback(
//             @RequestParam String code,
//             @RequestParam String state
//     ) throws Exception {

//         googleMeetService.exchangeCodeForTokens(code, state);
//         return ResponseEntity.ok("Google Connected Successfully");
//     }

//     //Schedule Meeting
//     @PostMapping("/schedule/{projectId}")
//     public ResponseEntity<?> scheduleMeeting(
//             Authentication authentication,
//             @PathVariable Long projectId,
//             @RequestBody MeetingScheduleRequestDto requestDto
//     ) {

//         try {

//             String adminId = authentication.getName();

//             UserAuthentication user = userRepo.findById(adminId)
//                     .orElseThrow(() -> new RuntimeException("User not found"));

//             if (!"ADMIN".equals(user.getRole())) {
//                 return ResponseEntity.status(403)
//                         .body("Only admin can create meetings");
//             }

//             AdminGoogleAuthEntity googleAuth =
//                     adminGoogleAuthRepo.findById(adminId)
//                             .orElseThrow(() ->
//                                     new RuntimeException("Google not connected"));

//             ProjectEntity project =
//                     projectRepo.findById(projectId)
//                             .orElseThrow(() ->
//                                     new RuntimeException("Project not found"));

//             var meetResponse =
//                     googleMeetService.createMeetEvent(
//                             googleAuth, project, requestDto);

//             ProjectMeetingEntity meeting = new ProjectMeetingEntity();
//             meeting.setAdminId(adminId);
//             meeting.setProjectId(projectId);
//             meeting.setMeetingId(meetResponse.getMeetingId());
//             meeting.setMeetingLink(meetResponse.getMeetingLink());
//             meeting.setTitle(requestDto.getTitle());
//             meeting.setDescription(requestDto.getDescription());
//             meeting.setStartTime(requestDto.getStartTime());
//             meeting.setEndTime(requestDto.getEndTime());

//             meetingRepo.save(meeting);

//             return ResponseEntity.ok(meetResponse.getMeetingLink());

//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                     .body("Meeting creation failed");
//         }
//     }
// }
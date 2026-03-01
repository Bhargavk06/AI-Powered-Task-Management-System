// package com.example.todo.Service;

// import java.io.IOException;
// import java.net.HttpURLConnection;
// import java.net.URL;
// import java.security.GeneralSecurityException;
// import java.time.ZoneId;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import com.example.todo.AdminGoogleAuthEntity;
// import com.example.todo.ProjectEntity;
// import com.example.todo.Repository.AdminGoogleAuthRepository;
// import com.example.todo.dto.GoogleMeetResponse;
// import com.example.todo.dto.MeetingScheduleRequestDto;
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
// import com.google.api.client.json.gson.GsonFactory;
// import com.google.api.services.calendar.Calendar;
// import com.google.api.services.calendar.model.*;

// @Service
// public class GoogleMeetService {

//     @Value("${google.client.id}")
//     private String CLIENT_ID;

//     @Value("${google.client.secret}")
//     private String CLIENT_SECRET;

//     @Value("${google.redirect.uri}")
//     private String REDIRECT_URI;

//     @Value("${google.scope}")
//     private String SCOPE;

//     @Autowired
//     private AdminGoogleAuthRepository adminGoogleAuthRepo;

//     private static final String APPLICATION_NAME = "Task Manager Meet";
//     private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

//     // Generate OAuth URL
//     public String generateOAuthUrl(String adminId) {

//         return "https://accounts.google.com/o/oauth2/v2/auth?" +
//                 "client_id=" + CLIENT_ID +
//                 "&redirect_uri=" + REDIRECT_URI +
//                 "&response_type=code" +
//                 "&scope=" + SCOPE +
//                 "&access_type=offline" +
//                 "&prompt=consent" +
//                 "&state=" + adminId;
//     }

//     // Exchange Authorization Code
//     public void exchangeCodeForTokens(String code, String adminId) throws Exception {

//         String body =
//                 "code=" + code +
//                 "&client_id=" + CLIENT_ID +
//                 "&client_secret=" + CLIENT_SECRET +
//                 "&redirect_uri=" + REDIRECT_URI +
//                 "&grant_type=authorization_code";

//         URL url = new URL("https://oauth2.googleapis.com/token");
//         HttpURLConnection conn = (HttpURLConnection) url.openConnection();

//         conn.setRequestMethod("POST");
//         conn.setDoOutput(true);
//         conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

//         conn.getOutputStream().write(body.getBytes());

//         ObjectMapper mapper = new ObjectMapper();
//         JsonNode jsonNode = mapper.readTree(conn.getInputStream());

//         String refreshToken = jsonNode.get("refresh_token").asText();

//         AdminGoogleAuthEntity auth = new AdminGoogleAuthEntity();
//         auth.setAdminId(adminId);
//         auth.setRefreshToken(refreshToken);
//         auth.setConnected(true);

//         adminGoogleAuthRepo.save(auth);
//     }

//     // 3️⃣ Create Google Meet Event
//     public GoogleMeetResponse createMeetEvent(
//             AdminGoogleAuthEntity googleAuth,
//             ProjectEntity project,
//             MeetingScheduleRequestDto requestDto
//     ) throws GeneralSecurityException, IOException {

//         String accessToken = refreshAccessToken(googleAuth.getRefreshToken());

//         final var httpTransport = GoogleNetHttpTransport.newTrustedTransport();

//         Calendar service = new Calendar.Builder(
//                 httpTransport,
//                 JSON_FACTORY,
//                 request -> request.getHeaders().setAuthorization("Bearer " + accessToken)
//         ).setApplicationName(APPLICATION_NAME).build();

//         Event event = new Event()
//                 .setSummary(requestDto.getTitle())
//                 .setDescription(requestDto.getDescription());

//         EventDateTime start = new EventDateTime()
//                 .setDateTime(new com.google.api.client.util.DateTime(
//                         requestDto.getStartTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
//                 .setTimeZone("Asia/Kolkata");

//         EventDateTime end = new EventDateTime()
//                 .setDateTime(new com.google.api.client.util.DateTime(
//                         requestDto.getEndTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
//                 .setTimeZone("Asia/Kolkata");

//         event.setStart(start);
//         event.setEnd(end);

//         ConferenceData conferenceData = new ConferenceData();
//         CreateConferenceRequest createConferenceRequest = new CreateConferenceRequest();
//         createConferenceRequest.setRequestId(UUID.randomUUID().toString());

//         ConferenceSolutionKey solutionKey = new ConferenceSolutionKey();
//         solutionKey.setType("hangoutsMeet");

//         createConferenceRequest.setConferenceSolutionKey(solutionKey);
//         conferenceData.setCreateRequest(createConferenceRequest);

//         event.setConferenceData(conferenceData);

//         Event createdEvent = service.events()
//                 .insert("primary", event)
//                 .setConferenceDataVersion(1)
//                 .setSendUpdates("all")
//                 .execute();

//         return new GoogleMeetResponse(
//                 createdEvent.getId(),
//                 createdEvent.getHangoutLink()
//         );
//     }

//     // 4️⃣ Refresh Access Token
//     private String refreshAccessToken(String refreshToken) throws IOException {

//         String body =
//                 "client_id=" + CLIENT_ID +
//                 "&client_secret=" + CLIENT_SECRET +
//                 "&refresh_token=" + refreshToken +
//                 "&grant_type=refresh_token";

//         URL url = new URL("https://oauth2.googleapis.com/token");
//         HttpURLConnection conn = (HttpURLConnection) url.openConnection();

//         conn.setRequestMethod("POST");
//         conn.setDoOutput(true);
//         conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

//         conn.getOutputStream().write(body.getBytes());

//         ObjectMapper mapper = new ObjectMapper();
//         JsonNode jsonNode = mapper.readTree(conn.getInputStream());

//         return jsonNode.get("access_token").asText();
//     }
// }
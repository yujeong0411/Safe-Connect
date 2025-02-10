package c207.camference.api.service.openapi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.api.dto.openapi.FireDeptDto;
import c207.camference.api.dto.openapi.HospitalDto;
import c207.camference.api.response.openapi.AedResponse;
import c207.camference.db.entity.etc.Aed;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.etc.MediCategory;
import c207.camference.db.entity.firestaff.FireDept;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.repository.etc.MediCategoryRepository;
import c207.camference.db.repository.firestaff.FireDeptRepository;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.openapi.AedRepository;
import c207.camference.db.repository.openapi.MediRepository;
import c207.camference.util.openapi.OpenApiUtil;
import c207.camference.util.response.ResponseUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.json.XML;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenApiServiceImpl implements OpenApiService {

    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    private final FireDeptRepository fireDeptRepository;
    private final HospitalRepository hospitalRepository;
    private final AedRepository aedRepository;
    private final MediRepository mediRepository;
    private final MediCategoryRepository mediCategoryRepository;

    @Value("${openApi.fireDeptUrl}")
    private String fireDeptUrl;

    @Value("${openApi.hospitalUrl}")
    private String hospitalUrl;

    @Value("${openApi.aedUrl}")
    private String aedUrl;

    @Value("${openApi.medicationUrl}")
    private String medicationUrl;

    @Value("${openApi.dataType}")
    private String dataType;

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.aedServiceKey}")
    private String aedServiceKey;

    @Override
    @Transactional
    public ResponseEntity<?> saveFireDept() {
        int page = 1;
        int perPage = 100;

        List<FireDeptDto> fireDeptDtos = new ArrayList<>();

        try {
            while (true) {
                String strUrl = fireDeptUrl + "?page=" + page + "&perPage=" + perPage + "&serviceKey=" + serviceKey;
                String response = OpenApiUtil.getHttpResponse(strUrl);

                JsonNode root = objectMapper.readTree(response);
                JsonNode dataArray = root.get("data");

                if (dataArray.isEmpty()) {
                    break;
                }

                for (JsonNode data : dataArray) {
                    FireDeptDto fireDeptDto = FireDeptDto.builder()
                            .fireDeptName(data.get("소방서").asText())
//                            .fireDeptName(data.get("119안전센터명").asText())
                            .fireDeptPhone(data.get("전화번호").asText())
                            .fireDeptRegion(data.get("주소").asText())
                            .build();
                    fireDeptDtos.add(fireDeptDto);

                    FireDept fireDept = modelMapper.map(fireDeptDto, FireDept.class);
                    fireDeptRepository.save(fireDept);
                }
                page++;
            }
            return ResponseEntity.ok().body(ResponseUtil.success(fireDeptDtos, "소방서 저장 성공"));


        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> saveHospital() {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        int pageNo = 1;
        int numOfRows = 100;

        List<HospitalDto> hospitalDtos = new ArrayList<>();

        try {
            while (true) {
                String urlStr = hospitalUrl + "?serviceKey=" + serviceKey + "&pageNo=" + pageNo + "&numOfRows=" + numOfRows;
                String response = OpenApiUtil.getHttpResponse(urlStr);

                // XML -> JSON
                JSONObject jsonResponse = XML.toJSONObject(response); // XML 문자열 -> JSON 객체
                String jsonStr = jsonResponse.toString();

                JsonNode root = objectMapper.readTree(jsonStr); // root = response
                JsonNode itemArray = root.path("response").path("body").path("items").path("item");

                if (itemArray.isEmpty()) {
                    break;
                }

                for (JsonNode item : itemArray) {
                    String hospitalLoginId = item.path("hpid").asText();
                    String hospitalPassword = passwordEncoder.encode(hospitalLoginId);

                    HospitalDto hospitalDto = HospitalDto.builder()
                            .hospitalLoginId(hospitalLoginId)
                            .hospitalPassword(hospitalPassword)
                            .hospitalName(item.path("dutyName").asText())
                            .hospitalPhone(item.path("dutyTel1").asText())
                            .hospitalAddress(item.path("dutyAddr").asText())
                            .hospitalLatitude(item.path("wgs84Lat").asDouble())
                            .hospitalLongitude(item.path("wgs84Lon").asDouble())
                            .build();

                    hospitalDtos.add(hospitalDto);

                    Hospital hospital = modelMapper.map(hospitalDto, Hospital.class);

                    // Point 객체 별도 생성 후 set
                    GeometryFactory geometryFactory = new GeometryFactory();
                    Point hospitalLocation = geometryFactory.createPoint(
                            new Coordinate(hospitalDto.getHospitalLongitude(), hospitalDto.getHospitalLatitude()));
                    hospital.setHospitalLocation(hospitalLocation);

                    hospitalRepository.save(hospital);
                }
                pageNo++;
            }
            return ResponseEntity.ok().body(ResponseUtil.success(hospitalDtos, "병원 저장 성공"));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> saveAed() {
        int pageNo = 1;
        int numOfRows = 100;

        List<AedResponse> aedResponses = new ArrayList<>();

        try {
            while (true) {
                String urlStr = aedUrl + "?serviceKey=" + aedServiceKey + "&numOfRows=" + numOfRows + "&pageNo=" + pageNo;
                String response = OpenApiUtil.getHttpResponse(urlStr);

                JSONObject jsonResponse = XML.toJSONObject(response);
                String jsonStr = jsonResponse.toString();

                JsonNode root = objectMapper.readTree(jsonStr);
                JsonNode itemArray = root.path("response").path("body").path("items").path("item");

                if (itemArray.isEmpty()) {
                    break;
                }

                for (JsonNode item : itemArray) {
                    Aed savedAed = aedRepository.save(modelMapper.map(AedResponse.builder()
                            .aedAddress(item.path("ADDRES").asText())
                            .aedPlace(item.path("BUILDPLACE").asText())
                            .aedLatitude(item.path("LAT").asDouble())
                            .aedLongitude(item.path("LON").asDouble())
                            .build(), Aed.class));

                    AedResponse aedResponse = modelMapper.map(savedAed, AedResponse.class);
                    aedResponses.add(aedResponse);
                }
                pageNo++;
            }
            return ResponseEntity.ok().body(ResponseUtil.success(aedResponses, "AED DB 저장 성공"));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> saveMedication() {
        // medi_category 1에 저장
        MediCategory category = mediCategoryRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
        List<MediDto> mediDtos = new ArrayList<>();

        int pageNo = 1;
        int numOfRows = 100;

        try {
            while (true) {
                String urlStr = medicationUrl + "?serviceKey=" + serviceKey +
                        "&pageNo=" + pageNo + "&numOfRows=" + numOfRows + "&type=" + dataType;
//                String response = OpenApiUtil.getHttpResponse(urlStr);
                String response = new String(OpenApiUtil.getHttpResponse(urlStr).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);

                JsonNode root = objectMapper.readTree(response);
                JsonNode itemsArray = root.path("body").path("items");


                if (itemsArray.isEmpty()) {
                    break;
                }

                for (JsonNode item : itemsArray) {
                    Medi saveMedi = mediRepository.save(modelMapper.map(MediDto.builder()
                            .mediName(item.path("ITEM_NAME").asText())
                            .mediCategory(category)
                            .build(), Medi.class));
                    mediDtos.add(MediDto.builder()
                            .mediId(saveMedi.getMediId())
                            .mediName(saveMedi.getMediName())
                            .build());
                }
                pageNo++;
            }
            MediCategoryDto categoryDto = MediCategoryDto.builder()
                    .categoryId(category.getMediCategoryId())
                    .categoryName(category.getMediCategoryName())
                    .mediList(mediDtos)
                    .build();
            return ResponseEntity.ok().body(ResponseUtil.success(categoryDto, "복용약물 DB 저장 성공"));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

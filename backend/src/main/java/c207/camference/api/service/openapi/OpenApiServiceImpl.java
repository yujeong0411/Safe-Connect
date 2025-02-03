package c207.camference.api.service.openapi;

import c207.camference.api.dto.openapi.FireDeptDto;
import c207.camference.api.dto.openapi.HospitalDto;
import c207.camference.db.entity.firestaff.FireDept;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.repository.firestaff.FireDeptRepository;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.util.openapi.OpenApiUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.json.XML;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenApiServiceImpl implements OpenApiService {

    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    private final FireDeptRepository fireDeptRepository;
    private final HospitalRepository hospitalRepository;

    @Value("${openApi.fireDeptUrl}")
    private String fireDeptUrl;

    @Value("${openApi.hospitalUrl}")
    private String hospitalUrl;

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Override
    @Transactional
    public List<FireDeptDto> saveFireDept() {
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
            return fireDeptDtos;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public List<HospitalDto> saveHospital() {
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
                    HospitalDto hospitalDto = HospitalDto.builder()
                            .hospitalLoginId(item.path("hpid").asText())
                            .hospitalPassword(item.path("hpid").asText())
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
            return hospitalDtos;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

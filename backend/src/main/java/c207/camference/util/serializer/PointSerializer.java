package c207.camference.util.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.locationtech.jts.geom.Point;

import java.io.IOException;

public class PointSerializer extends JsonSerializer<Point> {

    @Override
    public void serialize(Point point, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (point == null) {
            gen.writeNull();
        } else {
            gen.writeStartObject();
            gen.writeNumberField("longitude", point.getX());
            gen.writeNumberField("latitude", point.getY());
            gen.writeEndObject();
        }
    }
}

import com.hivext.api.Response;
import org.yaml.snakeyaml.Yaml;
import com.hivext.api.core.utils.Transport;

// WordPress Multi-Node LEMP Stack - No LiteSpeed option
var cdnAppid = "c05ffa5b45628a2a0c95467ebca8a0b4test";
var isCDN = jelastic.dev.apps.GetApp(cdnAppid);

var settings = jps.settings;
var fields = {};
for (var i = 0, field; field = jps.settings.fields[i]; i++)
  fields[field.name] = field;

// Check CDN availability
if (isCDN.result == 0 || isCDN.result == Response.PERMISSION_DENIED) {
  fields["cdn-addon"].hidden = false;
  fields["cdn-addon"].value = true;
} else {
  fields["cdn-addon"].hidden = true;
  fields["cdn-addon"].value = false;
}

// Set WooCommerce and Multisite to depend on WordPress checkbox
fields["woocommerce"].dependsOn = {
  field: "wp-addon",
  value: true
};

fields["mu-addon"].dependsOn = {
  field: "wp-addon",
  value: true
};

return {
    result: 0,
    settings: settings
};

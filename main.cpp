#include <iostream>
#include <fstream>
#include <sstream>
#include "httplib.h"       // Single-header HTTP server library (yhirose/cpp-httplib)
#include "data_structures.h"
#include "calculator.h"

/**
 * Helper utility: Reads static asset files from disk into raw string buffers.
 * Returns empty string if file handle fails to open.
 */
std::string read_file(const std::string& path) {
    std::ifstream file(path);
    if (!file) return "";
    std::ostringstream ss;
    ss << file.rdbuf();
    return ss.str();
}

/**
 * Helper utility: Sanitizes C++ std::to_string() double output.
 * Strips trailing zeros and redundant decimal points (e.g., "12.500000" -> "12.5", "5.000000" -> "5").
 */
std::string trim_zeros(double num) {
    std::string str = std::to_string(num);
    
    // Erase trailing zeros after decimal point
    str.erase(str.find_last_not_of('0') + 1, std::string::npos);
    
    // Erase trailing decimal point if number is an integer
    str.erase(str.find_last_not_of('.') + 1, std::string::npos);
    
    return str;
}

int main() {
    // Instantiate HTTP web server
    httplib::Server svr;

    /* ==========================================
       STATIC FILE ROUTING (FRONTEND ASSETS)
       ========================================== */

    // Route: Root URL "/" serves index.html
    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
        std::string html = read_file("index.html");
        if (html.empty()) {
            res.status = 404;
            res.set_content("index.html not found", "text/plain");
            return;
        }
        res.set_content(html, "text/html");
    });

    // Route: CSS Stylesheet
    svr.Get("/style.css", [](const httplib::Request&, httplib::Response& res) {
        std::string css = read_file("style.css");
        if (css.empty()) {
            res.status = 404;
            res.set_content("style.css not found", "text/plain");
            return;
        }
        res.set_content(css, "text/css");
    });

    // Route: Client JavaScript Application Logic
    svr.Get("/script.js", [](const httplib::Request&, httplib::Response& res) {
        std::string js = read_file("script.js");
        if (js.empty()) {
            res.status = 404;
            res.set_content("script.js not found", "text/plain");
            return;
        }
        res.set_content(js, "text/javascript");
    });

    /* ==========================================
       REST API ROUTING (EVALUATION ENGINE)
       ========================================== */

    // Endpoint: /calculate?expression=<URL_ENCODED_MATH_STRING>
    svr.Get("/calculate", [](const httplib::Request& req, httplib::Response& res) {
        std::string expression = req.get_param_value("expression");
        
        // Pass query parameter expression into Shunting-Yard evaluator
        double result = pemdas(expression);
        std::string r = trim_zeros(result);

        res.set_content(r, "text/plain");
    });

    // Start HTTP server daemon listening on all network interfaces on port 8080
    std::cout << "Server is running on http://localhost:8080 ..." << std::flush;
    svr.listen("0.0.0.0", 8080);
    
    return 0;
}
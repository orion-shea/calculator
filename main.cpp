#include <iostream>
#include "httplib.h" // header that lets me make a server. I downloaded it from GH
#include <fstream>
#include <sstream>
#include "data_structures.h" //header with my stack code
#include "calculator.h" // takes care of the math stuff

std::string read_file(const std::string& path) {
    std::ifstream file(path);
    if (!file) return "";
    std::ostringstream ss;
    ss << file.rdbuf();
    return ss.str();
}

std::string trim_zeros(double num) {
    std::string str = std::to_string(num);
    
    // Remove trailing zeros
    str.erase(str.find_last_not_of('0') + 1, std::string::npos);
    
    // Remove trailing decimal point if no fractional part remains
    str.erase(str.find_last_not_of('.') + 1, std::string::npos);
    
    return str;
}

int main() {
    // 1. Create the server instance
    httplib::Server svr;

    // 2. Define a route for the root URL "/"
    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
        std::string html = read_file("index.html");
        if (html.empty()) {
            res.status = 404;
            res.set_content("index.html not found", "text/plain");
            return;
        }
        res.set_content(html, "text/html");
    });

    svr.Get("/style.css", [](const httplib::Request&, httplib::Response& res) {
        std::string css = read_file("style.css");
        if (css.empty()) {
            res.status = 404;
            res.set_content("style.css not found", "text/plain");
            return;
        }
        res.set_content(css, "text/css");
    });

    svr.Get("/script.js", [](const httplib::Request&, httplib::Response& res) {
        std::string js = read_file("script.js");
        if (js.empty()) {
            res.status = 404;
            res.set_content("script.js not found", "text/plain");
            return;
        }
        res.set_content(js, "text/javascript");
    });

    svr.Get("/calculate", [](const httplib::Request& req, httplib::Response& res) {
        std::string expression = req.get_param_value("expression");
        double result = pemdas(expression);
        std::string r = trim_zeros(result);

        res.set_content(r, "text/plain");
});

    // 3. Start the server on port 8080
    std::cout << "Server is running..." << std::flush;
    svr.listen("0.0.0.0", 8080);
    return 0;
}
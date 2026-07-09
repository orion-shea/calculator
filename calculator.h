#pragma once
#include <string>

double addition(double a, double b);
double subtraction(double a, double b);
double multiplication(double a, double b);
double division(double a, double b);
double pemdas(const std::string& expression); //const and & so that I don't duplicate, but pass by reference.
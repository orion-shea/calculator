#pragma once
#include <string>
#include "data_structures.h"

double pemdas(const std::string& expression); //const and & so that I don't duplicate, but pass by reference.
double evaluatePostfix(Queue& q);